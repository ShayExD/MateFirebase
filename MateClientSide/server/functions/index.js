import * as functions from 'firebase-functions'
import express from 'express'
import admin  from "firebase-admin"

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "mateapiconnection",
    "private_key_id": "964d7765bfa494288531d2b64f6cc132e4f9dfd0",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCw/qSW0OMiCsKQ\nJHZKoY35YH1G1df3TueqWZ64Fow51iO39NCr6xUxBIppGa+hmfDZJS1CP6UnVyOZ\nWP9d8eDRcdRfSfLVUdvBRcVeo9nE0sXL69y36NI8AwUhFosZ71m5n482oR4ERxea\nVpwqkOpG2Qu0D6u3sPr1+0+qZZ6xGE6ZlSRt85E4Rujjcrspu75LMJtpx+UzFTjX\nuHVyR3N4ugz2wdX4Pcu1ED0xFnFHvkGf+70WPqog4jfMUMb5Rwy2fUI42W6VgEV9\npMtum21oTIrjulWeesNDHEZM0qU17MjG4SkDe0PUT0QY0Md08Au0U5l7WB3lUZ1l\n73hWRJ8hAgMBAAECggEAAo9wGgcmpk16QJI+yeVglRHZcBN79LhbSyxcP+4XZvxc\nibQWCxWbCcRBZw6uQD0r20KcRG4Aouh8mSgCRirvfqIfQVteeBSKKZzLc4sf2rbg\nkfqyXOXxGW7YVYuin/Glm5pQd1jRGFy0UtkJGGfJHsoebxNECkkaQUHf1l99fPLu\nmBZfUd1V8sNTHpDZ6yAPmADEXl113Ff7+sX+EHYFFGrnHb5gsTy6MmD4/hFARYN9\n/c2II+gkjEsvDUaKFuPFE7u1+3jqzyc/311Bgk8MP6tDlK9doA0fpOPTnPvzXBkB\nx5m2Z+XVoJvW86lffab2f/v6o7OSA13zg0e/Np/MsQKBgQDVJNQ02frcy66gVNs9\nJmiiHbqV5dJ68OZ6U5DURWRX3Z7b8EXGHk9NK13J+fKygY4SKPLnOkAfjfoPy77E\ngNRaX8pIH5mQoQTVvpuJR+31MHdxwimR29RFlKADPnJzqT6RycqSjyarIHZn5Vc8\nPu+ywR5sA4044hTq8NJuGRaTkQKBgQDUlRrtkUkQHq7ln7gHvOJvP0JVQMQLWrO9\nYiS22koh7eNnLE121V5KTV2gPR8ejHba0xf+ysPThIbWsWK9OD7bz5eMqAZHZXiL\nJBz6JX36c7iE9mWJeMjVhLpKaNOHqUL4awjTTno0GHj/cMIoxTHonjJtTLXKagMs\nJcbCbtFqkQKBgQCGsVJk38dXFmQRL+6n8wi2QgEyTty3ElsjvIFOk1d46zVDmdAO\nBgNpKdmIFKrZQWPNeBEgLEBvcGIw7zlrploLjnMfJtD9g7Oxe1WA6HKoumsQ+XkZ\nkojPO7/urNzY2IAQ0ytveIUgKVCKEXUSPldtZ/rYmVn6M2yyl2LzbmlE8QKBgQCV\nK9wtgJmoeh94ek+E/oJWVimR8VSgMxGVf10MArmqfWfpaikhjjAQK6HbY4iGw0JT\n43UfEeHAd2q3FNqYtPNHA7DwvqdJSmcAHGNJFS4FpVaB1vUBNoSXb//ZXx2wQJIC\nB/m1bYhLLjEZ7mIQge+3r+rqz71xQFrhi9Chd2n0QQKBgGd/+0JKqXX1FMPrtnPf\n8ERuvCL7/mQRrdF7nCXQ0F9VSmSlBMPTCuNwFZr2j2OO2vmgcwf+m/49Ti2LzgmL\npy4xMSViaeyWj21saYsXdDyqAjrzQRU9j3W/X1sS1SV9nZPLx71VPlZ02dYP/r88\nH1w96XcCdV5Ikpgvr0f2agML\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-nudqk@mateapiconnection.iam.gserviceaccount.com",
    "client_id": "107309428933036817699",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-nudqk%40mateapiconnection.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
  ),
  databaseURL: "https://mateserver-61da3-default-rtdb.firebaseio.com"
});


const db = admin.firestore();

const app = express();
app.get("/", (req, res)=>{
  res.send("Checssssssk");
});



app.get("/user", async (req, res) => {
    try {
      const customerRef = await db.collection("users").get();
      const users = [];
      customerRef.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });
      console.log(users);
      res.send(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).send("Error fetching users");
    }
  });



app.post("/user", (req, res)=>{
  console.log(req.body);
  res.send("Checssssssk");
});

export const mateapi =functions.https.onRequest(app);