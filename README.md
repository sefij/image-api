# Image-API

A RESTful API built with Node.js(Typescript), MongoDB, RabbitMQ, Minio(object store with S3ish sdk).

### About

Designed with real time performance and usability in mind.

While researching how to implement this api, I decided to avoid storing all the files in MongoDB. Therefore I added the usage of Minio for file storage and proceeded to save the image details in MongoDB.


### Important environnment variables in the docker-compose.yml

- NODE_PORT
- QUEUE_URI
- S3_URI
- S3_ACCESS_KEY/MINIO_ACCESS_KEY
- S3_SECRET_KEY/MINIO_SECRET_KEY
- MONGO_SERVER
- MONGO_PORT
- MONGO_USER
- MONGO_PASS
- DB_NAME/MONGO_INITDB_DATABASE


### Install $ start

```
1. git clone
2. docker-compose up -d --build

```