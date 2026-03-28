const {ObjectId} = require("mongodb");
const {getdb} = require("../utils/databaseUtil");

module.exports = class User {
    constructor(fname, lname, username, email, password, _id){
        this.fname = fname;
        this.lname = lname;
        this.username = username;
        this.email = email;
        this.password = password;
        if(_id) {
            this._id = _id;
        }
    }

     userSave() {
        const db = getdb();
        return db.collection("user").insertOne(this);
    }

    static findbyEmail(email) {
        const db = getdb();
        return db.collection("user").findOne({email: email});
    }

    static findbyName(name) {
        const db = getdb();
        return db.collection("user").find({fname: name}).toArray();
    }

    static findbyUsername(username) {
        const db = getdb();
        return db.collection("user").find({username: username}).next();
    }

    static delbyuserid(id){
        const db = getdb();
        return db.collection("user").deleteOne({_id: new ObjectId(id)});
    }

    static findbyId(id) {
        const db = getdb();
        return db.collection("user").findOne({_id: new ObjectId(id)});
    }

    static async updatePass(password, id) {
        const db = getdb();

        const result = await db.collection("user").updateOne(
            {_id: new ObjectId(id)},
            {$set:{password: password}}
        );
        return result.modifiedCount === 1;
    }
}