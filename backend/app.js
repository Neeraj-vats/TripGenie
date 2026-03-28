const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const rootDir = require("./utils/pathUtil");

//database module
const DB_Path = "mongodb://airbnbfinal:ritishhbansal@ac-cxwuxfx-shard-00-00.j0tresv.mongodb.net:27017,ac-cxwuxfx-shard-00-01.j0tresv.mongodb.net:27017,ac-cxwuxfx-shard-00-02.j0tresv.mongodb.net:27017/?ssl=true&replicaSet=atlas-k452qn-shard-0&authSource=admin&appName=Airbnb2";
const Mongodbstore = require("connect-mongodb-session")(session);
const { mongoConnect } = require("./utils/databaseUtil");

//local module
const authRouter = require("./routers/authRouter");
const tripRouter = require("./routers/tripRouter")

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use("/api", authRouter);
app.use("/api", tripRouter);

const PORT = 2376;
mongoConnect(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on address http://localhost:${PORT}`);
    });
});