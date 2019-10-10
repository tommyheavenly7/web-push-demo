const VAPID = require('../../backend/vapid.json');
const LOG_SERVER = 'https://backend.local/';

const getRequest = async (url) => {
    const response = await fetch(url + '&t=' + (new Date).getTime(), {mode: 'no-cors'});
    response.then(response => {
        if (!!!response.ok) {
            throw Error('Request failed.');
        }
    }).catch(error => console.log(error.message.toString()));
};

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

const showPushNotification = async (datum, swRegistration) => {
    const options = {
        body: datum.body,
        title: datum.title,
        icon: datum.icon,
        tag: datum.message_id,
        data: {
            url: datum.data.url,
            mid: datum.data.mid
        }
    };
    await swRegistration.showNotification(datum.title, options);
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
    const datum = JSON.parse(event.data.text());
    const notificationData = {
        body: datum.text,
        title: 'Tommy November7',
        icon: 'https://frontend.local/favicon.ico',
        data: {
            url: datum.data.url,
            mid: datum.data.mid,
        }
    };
    await showPushNotification(notificationData, self.registration)
        .then(_ => console.log('  ', event.data.text()));
});

self.addEventListener('notificationclick', async (event) => {
    console.log('ServiceWorker event: ' + event.type);
    event.notification.close();
    const url = event.notification.data.url;
    if (!url) {
        return;
    }
    event.waitUntil(
        clients.matchAll({
            type: 'window'
        }).then(function () {
            if (clients.openWindow) {
                return clients.openWindow(url)
            }
        })
    );
    // getRequest(LOG_SERVER + 'history/click.gif?mid=' + event.notification.data.mid).then(_ => console.log(''));
});

console.log('Hello from ServiceWorker.');
