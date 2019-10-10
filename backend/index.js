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
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/subscriptions', (req, res) => res.json({subscribers: dummyDb.subscriptions}));
app.delete('/unsubscribe/:target', (req, res) => {
    const target = req.param('target').toString();
    if (target === 'all') {
        dummyDb.subscriptions = [];
    } else {
        dummyDb.subscriptions.splice(parseInt(target), 1);
    }
    res.json({subscribers: dummyDb.subscriptions})
});

app.get('/send-notification', (req, res) => {
    dummyDb.subscriptions.forEach(subscription => {
        const fixedMessage = {
            "text": "Hello World",
            "data": {
                "url": "https://frontend.local/page.html",
                "mid": 999
            }
        };
        const message = JSON.stringify(fixedMessage);
        sendNotification(subscription, message);
        res.json({message: 'message sent.'});
    });
});
app.post('/send-notification', (req, res) => {
    dummyDb.subscriptions.forEach(subscription => {
        const message = JSON.stringify(req.body);
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
