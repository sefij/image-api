db.createUser({
  user: "datauser",
  pwd: "QwertyDataUserPassword",
  roles: [
    {
      role: "readWrite",
      db: "data"
    },
  ],
});
