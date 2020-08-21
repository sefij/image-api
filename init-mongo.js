db.createCollection("images")
db.createUser({user: "data",pwd: "data",roles: [{role: "readWrite",db: "data"}]});