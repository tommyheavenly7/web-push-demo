const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const webpush = require('web-push');
const VAPID = require('./vapid.json');

// monitoring port
const PORT = 4000;

//setting our previously generated VAPID keys
webpush.setVapidDetails('https://frontend.local/', VAPID.public, VAPID.private);

// init express
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// subscribers
const dummyDb = {subscriptions: []}; //dummy in memory store
const saveToDatabase = async subscription => {
    await dummyDb.subscriptions.push(subscription);
};

//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend = '') => {
    webpush.sendNotification(subscription, dataToSend)
};

/**
 * Routing
 */
app.get("/", (req, res) => res.send("Hello World!"));
app.get("/subscriptions", (req, res) => res.json({subscribers: dummyDb.subscriptions}));

app.get('/send-notification', (req, res) => {
    dummyDb.subscriptions.forEach(subscription => {
        const message = 'Hello World';
        sendNotification(subscription, message);
        res.json({message: 'message sent.'});
    });
});
app.post('/send-notification', (req, res) => {
    dummyDb.subscriptions.forEach(subscription => {
        const message = req.body.text.toString();
        sendNotification(subscription, message);
        res.json({message: 'message sent'});
    });
});

app.post("/save-subscription", async (req, res) => {
    const subscription = req.body;
    await saveToDatabase(subscription).then(_ => res.json({message: "success?"}));
});

/**
 * Listener
 */
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
