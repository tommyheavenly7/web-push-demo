// values of Notification.permission
const PERMISSION_GRANTED = 'granted';
const PERMISSION_DENIED = 'denied';
const PERMISSION_DEFAULT = 'default';

const checkIfRequiredObjectsExist = _ => {
    if (!("serviceWorker" in navigator)) {
        throw new Error("No Service Worker support!");
    }
    if (!("PushManager" in window)) {
        throw new Error("No Push API Support!");
    }
    if (!("Notification" in window)) {
        throw new Error("No Notification API Support!");
    }
};

const checkIfPermitted = async _ => {
    const permission = Notification.permission;
    if (permission === PERMISSION_GRANTED) {
        return permission;
    }

    return await askForPermission();
};

const askForPermission = async _ => {
    const permission = await Notification.requestPermission();
    if (permission !== PERMISSION_GRANTED) {
        throw new Error("Permission not granted for Notification");
    }

    return permission;
};

const main = _ => {
    checkIfRequiredObjectsExist();
    checkIfPermitted().then( async permission => {
        console.log('notification permission: ' + permission);
        await navigator.serviceWorker.register("dist/service.js")
            .catch( error => console.error(error.toString()));
    });
};

main();
