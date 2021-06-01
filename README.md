This is the monitoring app for project lifeplans file transfer milddlesoftware.

### Running locally

1. Generate api-token from lifeplan-backend.
2. Have an MySQL database running. 
3. Copy and rename .env.example into .env
4. Add required values to .env
5. Run the app with `docker compse up`
6. If this is the first time running it, add user to MySQL users-table, with password hashed so that it is compatible with bcrypt-libary.


##### If developing front and backend separately

Backend:
1. Copy the .env into /backend.
2. Navigate to /backend.
3. If needed frontend can be built with `npm run build:ui`.
4. Run `npm ci` to install dependencies. 
5. Run `npm run dev`, which will start backend in `localhost:8081`.

Frontend:
1. Navigate to /frontend
2. Run `npm ci` to install dependencies. 
3. Start frontend with `npm run start`, which will start it at `localhost:3000`, and it expects to find backend running at `localhost:8081`.

### Openshift deployment, using Luomus dockerhub

1. Build image for with `docker build -t luomus/lifeplan-monitor:latest`
2. Log in to docker
3. Push the image to dockerhub with `docker push luomus/lifeplan-monitor:latest`
4. Begin by creating a MySQL from the catalog
5. Add secret and configmap, both with name lifeplan-monitor, see /openshift/lifeplan-monitor-deploymentconfig.yaml for ccorrect split.
6. Import lifeplan-monitor-service.yaml
7. Import lifeplan-monitor-imagestream.yaml
8. Import lifeplan-monitor-deploymentconfig.yaml
9. Once lifeplan-monitor pod is running access MySQL:s pod, and manually add user to users-table.
