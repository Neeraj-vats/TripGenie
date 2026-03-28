const express = require("express");
const tripRouter = express.Router();

const tripController = require("../controllers/tripController");

tripRouter.post("/input", tripController.getinput);
tripRouter.post("/generatetrip", tripController.trip);

module.exports = tripRouter;