# Image-API

A RESTful API built with Node.js(Typescript), Nginx, MongoDB, RabbitMQ and Minio(object store with S3ish sdk).

### About

Designed with real time performance ,usability and scallability in mind.

While researching how to implement this api, I decided to avoid storing all the files contents in MongoDB. Therefore I added the usage of Minio for file storage and proceeded to save the image details in MongoDB.

Swagger will be at http://localhost:8080/api-docs/


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

some more files who need attention when changing these environmentr variables/settings:
 - init-mongo.js - the name of the database the mongodb instance is defined there
 - .env - the file has the definitions for the s3 bucket initialize
 - rabbitmq-config/definitions.json has all the queues thet are going to be initialize on startup, you can add more if you want to


### Install & start

```
1. git clone
2. docker-compose up -d --build
```

### Scaling

```
In the case we want to scale up out application we can use the following command:
docker-compose up -d --scale image-api=<amount of desired node instances>
```

### Postman

```
If you plan on using Postman for testing, 
I added a Postman collection config file on the rot directory called image-api.postman_collection.json

Enjoy :)
```