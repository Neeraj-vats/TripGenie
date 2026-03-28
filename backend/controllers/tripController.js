const {ObjectId} = require("mongodb");
const User = require("../models/auth");

exports.getinput = async (req, res, next) => {
    const {userid} = req.body;
    const user = await User.findbyId(userid);
    res.json({user});
};

exports.trip = async (req, res, next) => {
    const data = req.body;
    console.log("trip data is", data);
}