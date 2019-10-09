const VAPID = require('../../backend/vapid.json');

// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
};

const saveSubscription = async subscription => {
    console.log(JSON.stringify(subscription));
    const SERVER_URL = 'https://backend.local/save-subscription';
    const response = await fetch(SERVER_URL, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(subscription)
    });

    return response.json();
};

const showPushNotification = (title, body, swRegistration) => {
    const options = {
        body: body
    };
    swRegistration.showNotification(title, options).then(() => {
        console.log(options);
    });
};

self.addEventListener('activate', async (event) => {
    console.log('ServiceWorker event: ' + event.type);
    try {
        const applicationServerKey = urlB64ToUint8Array(VAPID.public);
        const options = {applicationServerKey, userVisibleOnly: true};

        console.log("  Try subscribing...");
        const subscription = await self.registration.pushManager.subscribe(options);
        console.log("  Subscribed.");
        const response = await saveSubscription(subscription);
        console.log(response);
        console.log("  Subscription saved.");

    } catch (error) {
        console.log("Error", error.toString());
    }
});

self.addEventListener('install', async event => {
    console.log('ServiceWorker event: ' + event.type);
});

self.addEventListener('push', function (event) {
    if (!!!event.data) {
        console.log('Push event but no data');
        return;
    }
    console.log('ServiceWorker event: ' + event.type);
    console.log('  text: ', event.data.text());
    showPushNotification('Tommy November7', event.data.text(), self.registration);
});

console.log('Hello from ServiceWorker.');
