const dbConnect = require('../../db').dbConnect;

dbConnect.then((connection) => {
    console.log("Got the connection")
});