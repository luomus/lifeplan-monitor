This is the monitoring app for project lifeplans file transfer milddlesoftware.

###Running locally

As an prerequisite you should have an MySQL database running, and have generated an api-token for the lifelan backend. These, and other values diescribed in the file,  should be added to .env-file you can create by copying and renaming .env.example-file. 

The app can then be run using command `docker compse up`, and if this is the first time running it, an user must be added manually to the MySQL users-table, with password hashed so that it is compatible with bcrypt-libary.

While developing, front- and backends can be operated separately with npm, by navigating to either /backend or /frontend and and running `npm ci`. Afterwards backend can be started by running `npm run dev`, which will require .env to be copied to /backend and which will sart it at `localhost:8081`. Frontend is started with `npm run start`, which will start it at `localhost:3000`, and it expects to find backend running at `localhost:8081`. While developing backend, frontend can be built by using `npm run build:ui`, after which it will show the frontend to any requests which do no contain `/api/` in their path.