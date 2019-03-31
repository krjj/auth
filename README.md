<p align="center">
	<a href="https://gitmoji.carloscuesta.me">
		<img src="https://shipwaves.kshitij-jamdade.ml/images/logo.png" width="456" alt="gitmoji">
	</a>
</p>

<p align="center">
   <a href="">
		<img src="https://img.shields.io/github/last-commit/krjj/auth.svg" alt="">
	</a>
  <a href="">
		<img src="https://img.shields.io/github/commit-activity/m/krjj/auth.svg" alt="">
	</a>
  <a href="">
		<img src="https://img.shields.io/github/issues/krjj/auth.svg" alt="">
	</a>
  <a href="">
		<img src="https://img.shields.io/github/issues-closed-raw/krjj/auth.svg" alt="">
	</a>
  <a href="">
		<img src="https://img.shields.io/badge/license-MIT-green.svg" alt="">
	</a>
  <a href="">
		<img src="https://img.shields.io/github/forks/krjj/auth.svg?style=social" alt="">
	</a>
  <a href="">
		<img src="https://img.shields.io/github/stars/krjj/auth.svg?style=social" alt="">
	</a>
  <a href=">
		<img src="https://img.shields.io/github/watchers/krjj/auth.svg?style=social" alt="">
	</a>
</p>
                                                                                       
                                                                                       
                                                                                       
                                                                                       




# About

Auth is flexible authentication solution.

✨ Features
- Is nodejs based.
- Stores session data in redis store.
- Persistent data stored in MongoDB.
- Has active session management functionality.
- Can display all the logged in/active session.
- Has ability to perform targeted session invalidation.
- Has ability to logout from all the sessions.
- Can store session context data such as : ip, login-time, device.
- IP to location resolver using GeoLite IP.
- Has configurable session TTL. Default is 86400 seconds.

## 💽 Installation

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


## :wrench: Usage

To start the server in production mode

```bash
yarn run start
```
 ⚠️ Development mode

```bash
yarn run dev
```


## 💻 Live Demo

For demo purpose the instance is running on the DO Droplet.
Location of the API Server - [API Server](https://api.kshitij-jamdade.ml).

The above server is configured in following way - 
1. Nginx as a reverse proxy.
2. HTTPS connections handled by Nginx.
3. Letsencrypt SSL cert generated.
4. Node-based Auth API Server managed by PM2. Running in daemonized form.
5. Uses hosted Redis Database. Provided by [Redis Labs](https://redislabs.com/).
6. Uses hosted MongoDB provided by [Mongo Atlas](https://www.mongodb.com/cloud/atlas).

Access demo front-end [here](https://shipwaves.kshitij-jamdade.ml/login)

## 🤖 Environment variables

All the environment variables are store in .env file.

| Variable  | Description |
| ------------- | ------------- |
| redis-host  | Host name or an IP address  |
| redis-port  | Redis port  |
| redis-password  | If your instance is password protected, used for authentication   |
| mongo-connect-uri  | Url with mongodb+srv:// protocol  |
| session-ttl-secs | Defines how long session should be valid after which the session is invalidated automatically. Default is 86400 seconds or 1 Day.  |

## 🛠 Technology Stack
- NodeJS
- Fastify
- Redis
- MongoDB

## 🤝 Contribute [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📜 License
[MIT](https://choosealicense.com/licenses/mit/)
