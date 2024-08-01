import * as functions from 'firebase-functions';
import express from 'express';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';

const app = express();
app.use(bodyParser.json());


////// User Services

app.get('/user', (req, res) => {
  res.send("Hello User");
});

app.post('/check', async (req, res) => {
  console.log(req.body);
  try {
    console.log(req.body);
    const { uid, test } = req.body;
    if (test === undefined) {
      return res.status(400).send("Missing test in request body");
    }
    await firestore.collection('check').add({ test });
    res.send("Success");
  } catch (error) {
    console.error("Error updating Firestore:", error);
    res.status(500).send("Error updating Firestore");
  }
});

app.get('/check', async (req, res) => {
  try {
    console.log("Fetching documents from 'check' collection...");
    const snapshot = await firestore.collection('check').get();

    if (snapshot.empty) {
      console.log("No documents found in the 'check' collection");
      return res.status(404).send("No documents found in the 'check' collection");
    }

    let checkData = [];
    snapshot.forEach(doc => {
      checkData.push({ id: doc.id, ...doc.data() });
    });

    console.log("Documents fetched successfully");
    res.status(200).json(checkData);
  } catch (error) {
    console.error("Error retrieving data from Firestore:", error);
    res.status(500).send("Error retrieving data from Firestore");
  }
});

app.post('/createUser', async (req, res) => {
  try {
    console.log(req.body);
    const { uid, attributes } = req.body;

    if (!uid || !attributes) {
      return res.status(400).send("Missing uid or attributes");
    }

    await firestore.collection('users').doc(uid).set(attributes);
    res.status(201).send("User attributes added");
  } catch (error) {
    console.error("Error adding user attributes:", error);
    res.status(500).send(`Error adding user attributes: ${error.message}`);
  }
});

////// Trip Services

app.get('/trip', (req, res) => {
  res.send("Hello trip");
});

export const mateApi = functions.https.onRequest(app);
