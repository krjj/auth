# Auth :closed_lock_with_key:

Authentication service with support for active session management.



## Installation

Clone this repo

```bash
git clone https://github.com/krjj/auth.git
```

then install dependencies

```bash
yarn install 
or
npm install
```


## Usage

To start the server

```bash
yarn run start
```

## Live Demo

For demo purpose the instance is running on the DO Droplet.
Location of the API Server - [API Server](https://api.kshitij-jamdade.ml).

The above server is configured in following way - 
1. Nginx as a reverse proxy.
2. HTTPS connections handled by Nginx.
3. Letsencrypt SSL cert generated.
4. Node-based Auth API Server managed by PM2. Running in daemonized form.
5. Uses hosted Redis Database. Provided by [Redis Labs](https://redislabs.com/).
6. Uses hosted MongoDB provided by [Mongo Atlas](https://www.mongodb.com/cloud/atlas).



## Environment variables

All the environment variables are store in .env file.

| Variable  | Description |
| ------------- | ------------- |
| redis-host  | Host name or an IP address  |
| redis-port  | Redis port  |
| redis-password  | If your instance is password protected, used for authentication   |
| mongo-connect-uri  | Url with mongodb+srv:// protocol  |
| session-ttl-secs | Defines how long session should be valid after which the session is invalidated automatically. Default is 86400 seconds or 1 Day.  |

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
