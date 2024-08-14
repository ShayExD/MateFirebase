import * as functions from 'firebase-functions'
import express from 'express'
import admin from 'firebase-admin'
// import { defaultValues } from '../../src/utils';

const defaultValues = {
  uid: 0,
  fullname: '',
  password: '',
  introduction: '',
  gender: ' ',
  age: 0,
  instagram: '',
  email: '',
  phoneNumber: '',
  profileImage: 'https://i.imgur.com/LBIwlSy.png',
  city: '',
  travelPlan: [],
  tripInterests: [],
}
const serviceAccount = {
  type: 'service_account',
  project_id: 'mateapiconnection',
  private_key_id: '964d7765bfa494288531d2b64f6cc132e4f9dfd0',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCw/qSW0OMiCsKQ\nJHZKoY35YH1G1df3TueqWZ64Fow51iO39NCr6xUxBIppGa+hmfDZJS1CP6UnVyOZ\nWP9d8eDRcdRfSfLVUdvBRcVeo9nE0sXL69y36NI8AwUhFosZ71m5n482oR4ERxea\nVpwqkOpG2Qu0D6u3sPr1+0+qZZ6xGE6ZlSRt85E4Rujjcrspu75LMJtpx+UzFTjX\nuHVyR3N4ugz2wdX4Pcu1ED0xFnFHvkGf+70WPqog4jfMUMb5Rwy2fUI42W6VgEV9\npMtum21oTIrjulWeesNDHEZM0qU17MjG4SkDe0PUT0QY0Md08Au0U5l7WB3lUZ1l\n73hWRJ8hAgMBAAECggEAAo9wGgcmpk16QJI+yeVglRHZcBN79LhbSyxcP+4XZvxc\nibQWCxWbCcRBZw6uQD0r20KcRG4Aouh8mSgCRirvfqIfQVteeBSKKZzLc4sf2rbg\nkfqyXOXxGW7YVYuin/Glm5pQd1jRGFy0UtkJGGfJHsoebxNECkkaQUHf1l99fPLu\nmBZfUd1V8sNTHpDZ6yAPmADEXl113Ff7+sX+EHYFFGrnHb5gsTy6MmD4/hFARYN9\n/c2II+gkjEsvDUaKFuPFE7u1+3jqzyc/311Bgk8MP6tDlK9doA0fpOPTnPvzXBkB\nx5m2Z+XVoJvW86lffab2f/v6o7OSA13zg0e/Np/MsQKBgQDVJNQ02frcy66gVNs9\nJmiiHbqV5dJ68OZ6U5DURWRX3Z7b8EXGHk9NK13J+fKygY4SKPLnOkAfjfoPy77E\ngNRaX8pIH5mQoQTVvpuJR+31MHdxwimR29RFlKADPnJzqT6RycqSjyarIHZn5Vc8\nPu+ywR5sA4044hTq8NJuGRaTkQKBgQDUlRrtkUkQHq7ln7gHvOJvP0JVQMQLWrO9\nYiS22koh7eNnLE121V5KTV2gPR8ejHba0xf+ysPThIbWsWK9OD7bz5eMqAZHZXiL\nJBz6JX36c7iE9mWJeMjVhLpKaNOHqUL4awjTTno0GHj/cMIoxTHonjJtTLXKagMs\nJcbCbtFqkQKBgQCGsVJk38dXFmQRL+6n8wi2QgEyTty3ElsjvIFOk1d46zVDmdAO\nBgNpKdmIFKrZQWPNeBEgLEBvcGIw7zlrploLjnMfJtD9g7Oxe1WA6HKoumsQ+XkZ\nkojPO7/urNzY2IAQ0ytveIUgKVCKEXUSPldtZ/rYmVn6M2yyl2LzbmlE8QKBgQCV\nK9wtgJmoeh94ek+E/oJWVimR8VSgMxGVf10MArmqfWfpaikhjjAQK6HbY4iGw0JT\n43UfEeHAd2q3FNqYtPNHA7DwvqdJSmcAHGNJFS4FpVaB1vUBNoSXb//ZXx2wQJIC\nB/m1bYhLLjEZ7mIQge+3r+rqz71xQFrhi9Chd2n0QQKBgGd/+0JKqXX1FMPrtnPf\n8ERuvCL7/mQRrdF7nCXQ0F9VSmSlBMPTCuNwFZr2j2OO2vmgcwf+m/49Ti2LzgmL\npy4xMSViaeyWj21saYsXdDyqAjrzQRU9j3W/X1sS1SV9nZPLx71VPlZ02dYP/r88\nH1w96XcCdV5Ikpgvr0f2agML\n-----END PRIVATE KEY-----\n',
  client_email:
    'firebase-adminsdk-nudqk@mateapiconnection.iam.gserviceaccount.com',
  client_id: '107309428933036817699',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-nudqk%40mateapiconnection.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://mateserver-61da3-default-rtdb.firebaseio.com',
})

const db = admin.firestore()

const app = express()

///////- User Services

app.post('/loginUser', async (req, res) => {
  const { uid } = req.body // Extract UID from request body

  if (!uid) {
    return res.status(400).json({ error: 'error' })
  }

  try {
    const userDoc = await db.collection('users').doc(uid).get() // Access the Firestore 'users' collection and fetch the document with the specified UID

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' })
    }

    const userData = userDoc.data() // Extract the user data from the document

    return res.status(200).json({ userData }) // Send the user data as a response
  } catch (error) {
    console.error('Error fetching user data:', error)
    return res.status(500).json({ error: 'Internal server error' }) // Handle and send back internal server error
  }
})

app.get('/getUserByUid/:uid', async (req, res) => {
  const { uid } = req.params // Get the UID from the URL parameters

  // console.log(uid)

  if (!uid) {
    return res.status(400).json({ error: 'UID is required' })
  }

  try {
    // Retrieve the user document
    const userDoc = await db.collection('users').doc(uid).get()

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' })
    }

    const userData = userDoc.data()
    userData.uid = uid // Include the UID in the response
    res.status(200).json(userData)
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

app.post('/createUser', async (req, res) => {
  const { uid, attributes } = req.body

  try {
    // Merge default values with incoming attributes
    const userData = { ...defaultValues, ...attributes, uid }

    await db.collection('users').doc(uid).set(userData)
    res.status(200).send({
      message: 'Registration Successful\nYou have successfully registered!',
      userData,
    })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).send({ error: 'Failed to create user' })
  }
})

app.put('/updateUser', async (req, res) => {
  const { uid, attributes } = req.body

  if (!uid || !attributes) {
    return res.status(400).json({ error: 'UID and attributes are required' })
  }

  try {
    // Use merge: true to update fields without overwriting the entire document
    await db.collection('users').doc(uid).set(attributes, { merge: true })

    // Fetch the updated user data
    const updatedUserDoc = await db.collection('users').doc(uid).get()
    const updatedUserData = updatedUserDoc.data()

    res
      .status(200)
      .send({ message: 'User updated successfully', userData: updatedUserData })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).send({ error: 'Failed to update user' })
  }
})

app.get('/getAllUsers', async (req, res) => {
  try {
    // Use merge: true to update fields without overwriting the entire document
    const usersFromFirestore = await db.collection('users').get()
    const usersList = usersFromFirestore.docs.map((doc) => ({
      ...doc.data(),
    }))

    // console.log(usersList);
    res.status(200).send(usersList)
  } catch (error) {
    console.error('Error to get all users:', error)
    res.status(500).send({ error: 'Failed to get all users' })
  }
})

///// - Trip Services

app.post('/createTrip', async (req, res) => {
  const {
    aboutTrip,
    destinations,
    endDate,
    joinedUsers,
    limitUsers,
    manageByUid,
    startDate,
    tripInterests,
    tripName,
    tripPictureUrl,
  } = req.body

  try {
    const newTrip = {
      aboutTrip,
      destinations,
      endDate: endDate,
      joinedUsers,
      limitUsers,
      manageByUid,
      startDate: startDate,
      tripInterests,
      tripName,
      tripPictureUrl,
    }

    const tripRef = await db.collection('trips').add(newTrip)
    res
      .status(201)
      .send({ message: 'Trip created successfully', tripId: tripRef.id })
  } catch (error) {
    console.error('Error creating trip:', error)
    res.status(500).send({ error: 'Failed to create trip' })
  }
})

app.get('/getAllTrips', async (req, res) => {
  try {
    const tripsFromFirestore = await db.collection('trips').get()
    const trips = tripsFromFirestore.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    // .filter(trip => trip.manageByUid !== uid);
    // console.log(trips);
    res.status(200).json(trips)
  } catch (error) {
    console.error('Error fetching trips:', error)
    res.status(500).json({ error: 'Failed to fetch trips' })
  }
})

app.delete('/deleteTrip', async (req, res) => {
  const { tripId } = req.body // Get the trip ID from the request body

  if (!tripId) {
    return res.status(400).json({ error: 'Trip ID is required' })
  }

  try {
    // Delete the trip document from the Firestore collection
    await db.collection('trips').doc(tripId).delete()
    res.status(200).send({ message: 'Trip deleted successfully' })
  } catch (error) {
    console.error('Error deleting trip:', error)
    res.status(500).send({ error: 'Failed to delete trip' })
  }
})

app.post('/joinTrip', async (req, res) => {
  const { tripId, uid } = req.body // Get the trip ID and user ID from the request body

  if (!tripId || !uid) {
    return res.status(400).json({ error: 'Trip ID and User ID are required' })
  }

  try {
    // Retrieve the user document
    const userDoc = await db.collection('users').doc(uid).get()

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' })
    }

    const userData = userDoc.data()
    // console.log(userDoc.data());

    // Retrieve the trip document
    const tripDoc = await db.collection('trips').doc(tripId).get()

    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Trip not found' })
    }

    const tripData = tripDoc.data()
    const { joinedUsers, limitUsers } = tripData

    // Check if the trip has available slots
    if (joinedUsers.length >= limitUsers) {
      return res.status(400).json({ error: 'Trip is full' })
    }

    // Check if the user is already in the joinedUsers array
    const isUserJoined = joinedUsers.some((user) => user.uid === uid)

    if (isUserJoined) {
      return res
        .status(400)
        .json({ error: 'User is already joined to the trip' })
    }

    // Add the user to the joinedUsers array
    joinedUsers.push(userData)

    // Update the trip document
    await db.collection('trips').doc(tripId).update({ joinedUsers })

    res
      .status(200)
      .send({ message: 'User successfully joined the trip', joinedUsers })
  } catch (error) {
    console.error('Error joining trip:', error)
    res.status(500).send({ error: 'Failed to join trip' })
  }
})

app.post('/leaveTrip', async (req, res) => {
  const { tripId, uid } = req.body // Get the trip ID and user ID from the request body

  if (!tripId || !uid) {
    return res.status(400).json({ error: 'Trip ID and User ID are required' })
  }

  try {
    // Retrieve the trip document
    const tripDoc = await db.collection('trips').doc(tripId).get()

    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Trip not found' })
    }

    const tripData = tripDoc.data()
    let { joinedUsers, manageByUid } = tripData

    // Check if the user is the manager of the trip
    if (manageByUid === uid) {
      // Delete the trip document
      await db.collection('trips').doc(tripId).delete()
      return res.status(200).send({
        message: 'Trip deleted successfully as the user is the manager',
      })
    }

    // Check if the user is in the joinedUsers array
    const userIndex = joinedUsers.findIndex((user) => user.uid === uid)

    if (userIndex === -1) {
      return res.status(400).json({ error: 'User is not joined to the trip' })
    }

    // Remove the user from the joinedUsers array
    joinedUsers.splice(userIndex, 1)

    // Update the trip document
    await db.collection('trips').doc(tripId).update({ joinedUsers })

    res
      .status(200)
      .send({ message: 'User successfully left the trip', joinedUsers })
  } catch (error) {
    console.error('Error leaving trip:', error)
    res.status(500).send({ error: 'Failed to leave trip' })
  }
})

app.get('/getTrip/:tripId', async (req, res) => {
  const { tripId } = req.params // Get the trip ID from the URL parameters

  if (!tripId) {
    return res.status(400).json({ error: 'Trip ID is required' })
  }

  try {
    // Retrieve the trip document
    const tripDoc = await db.collection('trips').doc(tripId).get()

    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Trip not found' })
    }

    const tripData = tripDoc.data()
    tripData.id = tripId
    res.status(200).json(tripData)
  } catch (error) {
    console.error('Error fetching trip:', error)
    res.status(500).json({ error: 'Failed to fetch trip' })
  }
})

app.post('/getUserTrips', async (req, res) => {
  const { uid } = req.body // Get the user ID from the request body

  if (!uid) {
    return res.status(400).json({ error: 'User ID is required' })
  }

  try {
    // Retrieve all trips
    const tripsFromFirestore = await db.collection('trips').get()
    const trips = tripsFromFirestore.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Filter trips to include only those where the user is in the joinedUsers array
    const userTrips = trips.filter((trip) =>
      trip.joinedUsers.some((user) => user.uid === uid),
    )

    res.status(200).json(userTrips)
  } catch (error) {
    console.error('Error fetching user trips:', error)
    res.status(500).json({ error: 'Failed to fetch user trips' })
  }
})

export const mateapi = functions.https.onRequest(app)
