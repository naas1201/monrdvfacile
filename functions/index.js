// --- MonRdvFacile - functions/index.js ---

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true}); // Initialize CORS middleware

// Initialize Firebase Admin SDK.
// This line should be at the top level, executed only once when the function instance starts.
admin.initializeApp();

// Get a reference to the Firestore database.
const db = admin.firestore();

// --- Helper Function for sending responses ---
const sendResponse = (response, statusCode, body) => {
  response.status(statusCode).send(body);
};

// --- 1. Create Event Function ---
exports.createEvent = functions.region("europe-west1") // Specify region, same as your Firestore
  .https.onRequest((req, res) => {
  cors(req, res, async () => { // Handle CORS
    if (req.method !== "POST") {
      return sendResponse(res, 405, {error: "Method Not Allowed"});
    }

    try {
      const eventData = req.body;

      // Basic Validation (add more as needed)
      if (!eventData.eventName || !eventData.eventStartDate || !eventData.adminPassword) {
        return sendResponse(res, 400, {error: "Missing required fields: eventName, eventStartDate, and adminPassword are required."});
      }

      // **SECURITY WARNING:** Storing plain text passwords is NOT secure for production.
      // In a real application, hash the adminPassword before storing it (e.g., using bcrypt).
      // For this educational version, we'll store it as is, but this is a critical security point.
      // Example: const hashedPassword = await bcrypt.hash(eventData.adminPassword, 10);
      // eventData.adminPassword = hashedPassword;

      const newEvent = {
        ...eventData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(), // Add server-side timestamp
      };

      const docRef = await db.collection("events").add(newEvent);
      sendResponse(res, 201, {success: true, message: "Event created successfully", eventId: docRef.id});

    } catch (error) {
      console.error("Error creating event:", error);
      sendResponse(res, 500, {error: "Internal Server Error while creating event."});
    }
  });
});

// --- 2. Get All Events Function ---
exports.getEvents = functions.region("Paris").https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "GET") {
      return sendResponse(res, 405, {error: "Method Not Allowed"});
    }

    try {
      let query = db.collection("events");

      // Basic Filtering (can be expanded)
      const { name, date } = req.query;
      if (name) {
        // Firestore does not support partial string matches directly like SQL's LIKE.
        // For simple "starts with" you can use .where('eventName', '>=', name).where('eventName', '<=', name + '\uf8ff')
        // For true full-text search, you'd typically integrate with a search service like Algolia or Typesense.
        // For this example, we'll fetch all and filter in memory if name is present (not ideal for large datasets).
      }
      if (date) {
        query = query.where("eventStartDate", ">=", date);
      }

      // Sorting
      query = query.orderBy("eventStartDate", "asc").orderBy("eventStartTime", "asc");

      const snapshot = await query.get();
      if (snapshot.empty) {
        return sendResponse(res, 200, []);
      }

      let events = [];
      snapshot.forEach(doc => {
        events.push({id: doc.id, ...doc.data()});
      });

      // In-memory filter for name (if partial match is needed and dataset is small)
      if (name) {
        events = events.filter(event => event.eventName && event.eventName.toLowerCase().includes(name.toLowerCase()));
      }

      sendResponse(res, 200, events);

    } catch (error) {
      console.error("Error getting events:", error);
      sendResponse(res, 500, {error: "Internal Server Error while fetching events."});
    }
  });
});

// --- 3. Get Single Event for Editing (Requires Auth) ---
exports.getEventForEdit = functions.region("europe-west1").https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") { // Using POST to send eventId and password in body
      return sendResponse(res, 405, {error: "Method Not Allowed"});
    }

    try {
      const {eventId, adminPassword} = req.body;

      if (!eventId || !adminPassword) {
        return sendResponse(res, 400, {error: "Event ID and Admin Password are required."});
      }

      const eventDoc = await db.collection("events").doc(eventId).get();

      if (!eventDoc.exists) {
        return sendResponse(res, 404, {error: "Event not found."});
      }

      const eventData = eventDoc.data();

      // **SECURITY WARNING:** Comparing plain text passwords. Use hashed password comparison in production.
      if (eventData.adminPassword !== adminPassword) {
        return sendResponse(res, 401, {error: "Incorrect admin password."});
      }

      sendResponse(res, 200, {id: eventDoc.id, ...eventData});

    } catch (error) {
      console.error("Error getting event for edit:", error);
      sendResponse(res, 500, {error: "Internal Server Error."});
    }
  });
});


// --- 4. Update Event Function ---
exports.updateEvent = functions.region("europe-west1").https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "PUT") {
      return sendResponse(res, 405, {error: "Method Not Allowed"});
    }

    try {
      const eventId = req.query.eventId; // Or get from req.body.eventId
      const updatedData = req.body.eventData; // Assuming all data to update is in eventData
      const adminPassword = req.body.adminPassword;

      if (!eventId || !updatedData || !adminPassword) {
        return sendResponse(res, 400, {error: "Event ID, event data, and admin password are required."});
      }

      const eventRef = db.collection("events").doc(eventId);
      const eventDoc = await eventRef.get();

      if (!eventDoc.exists) {
        return sendResponse(res, 404, {error: "Event not found."});
      }

      // **SECURITY WARNING:** Authenticate before update
      if (eventDoc.data().adminPassword !== adminPassword) {
        return sendResponse(res, 401, {error: "Incorrect admin password for update."});
      }

      // Remove adminPassword from updatedData if present, to prevent accidental change here
      // Password changes should be a separate, dedicated function if needed.
      delete updatedData.adminPassword;
      delete updatedData.id; // ID should not be changed

      await eventRef.update({
        ...updatedData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      sendResponse(res, 200, {success: true, message: "Event updated successfully."});

    } catch (error) {
      console.error("Error updating event:", error);
      sendResponse(res, 500, {error: "Internal Server Error while updating event."});
    }
  });
});

// --- 5. Delete Event Function ---
exports.deleteEvent = functions.region("europe-west1").https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "DELETE" && req.method !== "POST") { // Allow POST for body if DELETE with body is an issue
      return sendResponse(res, 405, {error: "Method Not Allowed"});
    }

    try {
      const eventId = req.query.eventId || req.body.eventId;
      const adminPassword = req.body.adminPassword; // Assuming password sent in body for DELETE too

      if (!eventId || !adminPassword) {
        return sendResponse(res, 400, {error: "Event ID and admin password are required."});
      }

      const eventRef = db.collection("events").doc(eventId);
      const eventDoc = await eventRef.get();

      if (!eventDoc.exists) {
        return sendResponse(res, 404, {error: "Event not found."});
      }

      // **SECURITY WARNING:** Authenticate before delete
      if (eventDoc.data().adminPassword !== adminPassword) {
        return sendResponse(res, 401, {error: "Incorrect admin password for delete."});
      }

      await eventRef.delete();
      sendResponse(res, 200, {success: true, message: "Event deleted successfully."});

    } catch (error) {
      console.error("Error deleting event:", error);
      sendResponse(res, 500, {error: "Internal Server Error while deleting event."});
    }
  });
});
