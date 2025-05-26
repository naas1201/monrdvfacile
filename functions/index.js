// --- MonRdvFacile - functions/index.js (Corrected for Paris region and syntax) ---

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true}); // Initialize CORS middleware

// Initialize Firebase Admin SDK.
admin.initializeApp();

// Get a reference to the Firestore database.
const db = admin.firestore();

// --- Helper Function for sending responses ---
const sendResponse = (response, statusCode, body) => {
  response.status(statusCode).send(body);
};

// --- 1. Create Event Function ---
exports.createEvent = functions.region("europe-west9") // Paris
  .https.onRequest((req, res) => {
  cors(req, res, async () => { // Handle CORS
    if (req.method !== "POST") {
      return sendResponse(res, 405, {error: "Method Not Allowed"});
    }

    try {
      const eventData = req.body;

      if (!eventData.eventName || !eventData.eventStartDate || !eventData.adminPassword) {
        return sendResponse(res, 400, {error: "Missing required fields: eventName, eventStartDate, and adminPassword are required."});
      }

      // **SECURITY WARNING:** Storing plain text passwords is NOT secure for production.
      // In a real application, hash the adminPassword before storing it (e.g., using bcrypt).
      const newEvent = {
        ...eventData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
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
exports.getEvents = functions.region("europe-west9") // Corrected: "europe-west9" and removed extra quote
  .https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "GET") {
      return sendResponse(res, 405, {error: "Method Not Allowed"});
    }

    try {
      let query = db.collection("events");
      const { name, date } = req.query;

      if (date) {
        query = query.where("eventStartDate", ">=", date);
      }

      query = query.orderBy("eventStartDate", "asc").orderBy("eventStartTime", "asc");

      const snapshot = await query.get();
      if (snapshot.empty) {
        return sendResponse(res, 200, []);
      }

      let events = [];
      snapshot.forEach(doc => {
        events.push({id: doc.id, ...doc.data()});
      });

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
exports.getEventForEdit = functions.region("europe-west9") // Corrected: "europe-west9"
  .https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
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

      if (eventData.adminPassword !== adminPassword) {
        return sendResponse(res, 401, {error: "Incorrect admin password."});
      }

      sendResponse(res, 200, {id: eventDoc.id, ...eventData});

    } catch (error) 
      console.error("Error getting event for edit:", error);
      sendResponse(res, 500, {error: "Internal Server Error."});
    }
  });
});


// --- 4. Update Event Function ---
exports.updateEvent = functions.region("europe-west9") // Paris
  .https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "PUT") {
      return sendResponse(res, 405, {error: "Method Not Allowed"});
    }

    try {
      const eventId = req.query.eventId;
      const updatedData = req.body.eventData;
      const adminPassword = req.body.adminPassword;

      if (!eventId || !updatedData || !adminPassword) {
        return sendResponse(res, 400, {error: "Event ID, event data, and admin password are required."});
      }

      const eventRef = db.collection("events").doc(eventId);
      const eventDoc = await eventRef.get();

      if (!eventDoc.exists) {
        return sendResponse(res, 404, {error: "Event not found."});
      }

      if (eventDoc.data().adminPassword !== adminPassword) {
        return sendResponse(res, 401, {error: "Incorrect admin password for update."});
      }

      delete updatedData.adminPassword;
      delete updatedData.id;

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
exports.deleteEvent = functions.region("europe-west9") // Corrected: "europe-west9" and removed extra quote
  .https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "DELETE" && req.method !== "POST") {
      return sendResponse(res, 405, {error: "Method Not Allowed"});
    }

    try {
      const eventId = req.query.eventId || req.body.eventId;
      const adminPassword = req.body.adminPassword;

      if (!eventId || !adminPassword) {
        return sendResponse(res, 400, {error: "Event ID and admin password are required."});
      }

      const eventRef = db.collection("events").doc(eventId);
      const eventDoc = await eventRef.get();

      if (!eventDoc.exists) {
        return sendResponse(res, 404, {error: "Event not found."});
      }

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
