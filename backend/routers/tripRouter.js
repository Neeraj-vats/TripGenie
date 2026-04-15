const express = require("express");
const tripRouter = express.Router();

const tripController = require("../controllers/tripController");

tripRouter.post("/input", tripController.getinput);
tripRouter.post("/generatetrip", tripController.trip);
tripRouter.get("/trips/:userid", tripController.listTrips);
tripRouter.get("/trip/:tripId", tripController.getTrip);
tripRouter.delete("/trip/:tripId", tripController.deleteTrip);
tripRouter.get("/settings/:id", tripController.settings);

module.exports = tripRouter;
