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

const showPushNotification = async (title, body, swRegistration) => {
    const options = {
        body: body
    };
    await swRegistration.showNotification(title, options);
};

self.addEventListener('install', async (event) => {
    console.log('ServiceWorker event: ' + event.type);
    await self.skipWaiting().then(_ => console.log('    skipped waiting.'));
});

self.addEventListener('activate', async (event) => {
    console.log('ServiceWorker event: ' + event.type);
    console.log('    activated:');
    const applicationServerKey = urlB64ToUint8Array(VAPID.public);
    const options = {applicationServerKey, userVisibleOnly: true};

    console.log("    Try subscribing...");
    const subscription = await self.registration.pushManager.subscribe(options);
    await saveSubscription(subscription).then(subscription => {
        console.log("    Subscription saved.");
        console.log(subscription);
    });
});

self.addEventListener('push', async (event) => {
    console.log('ServiceWorker event: ' + event.type);
    if (!!!event.data) {
        throw new Error('Push event but no data');
    }
    await showPushNotification('Tommy November7', event.data.text(), self.registration)
        .then(_ => console.log('  ', event.data.text()));
});

console.log('Hello from ServiceWorker.');
