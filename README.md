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

#### Subscriptions

- GET: [https://backend.local/subscriptions](https://backend.local/subscriptions)
- DELETE: [https://backend.local/unsubscribe/:target](https://backend.local/unsubscribe/)

`:target` can take an int as an array key or a keyword. 
An `int` can delete a single subscription. The backend app deletes an item tied with the array key.
The keyword, `all`, can delete all subscriptions at once.

Please note that your subscriptions only keep inside the memory. 
All the subscription will vanish every time you stop containers.

#### Send notification

- GET: [https://backend.local/send-notification](https://backend.local/send-notification)
- POST: [https://backend.local/send-notification](https://backend.local/send-notification)

Both `GET` and `POST` are available. If you want to send a custom message, 
send a POST request to the endpoint. The Request body can take JSON format. 
The `text` key contains the message text:
 
```json
{
	"text": "Hello beautiful world :)"
}
```

`GET` is only for convenience. Developers sometimes need an easy way to create a request. 
GET request will show a notification with a fixed message, `Hello World`.
