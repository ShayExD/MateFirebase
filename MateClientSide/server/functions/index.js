import * as functions from 'firebase-functions'


import express from 'express';
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.json())

app.get('/', (req , res )=>{
    res.send("Hello World");
})

app.get('/user', (req , res )=>{
    res.send("Hello check");
})

app.post('/user',(req , res )=>{
console.log(req.body)
res.send("We Created User")
})



export const helloWorld = functions.https.onRequest(app);