# Push Notification Demo

A forked version of [master-atul/web-push-demo](https://github.com/master-atul/web-push-demo).

- Origin: [master-atul/web-push-demo](https://github.com/master-atul/web-push-demo)
- Author: [@master-atul](https://github.com/master-atul)

A docker environment are available for the repo.
- [docker-for-web-push-demo](https://github.com/tommyheavenly7/docker-for-web-push-demo)

## Endpoints

### Frontend

- [https://frontend.local/](https://frontend.local/)

### Backend

You may see "Hello World!" message if the backend is appropriately running.

- [https://backend.local/](https://backend.local/)

### Current Subscriptions

- [https://backend.local/subscriptions](https://backend.local/subscriptions)

Please note that your subscriptions only keep inside the memory. 
All the subscription will vanish every time you stop containers.

### Send notification

- [https://backend.local/send-notification](https://backend.local/send-notification)

Both `GET` and `POST` are acceptable. You may see the Hello World message
 in your notification centre, if you send a GET request.

In case if you want to send custom messages, send a POST request to the endpoint. 
 Request body can take JSON format. The `text` key contains the message text:
 
 ```json
{
	"text": "Hello beautiful world :)"
}
```
