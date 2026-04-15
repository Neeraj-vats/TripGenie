const { ObjectId } = require("mongodb");
const User = require("../models/auth");
const Trip = require("../models/trip");

const DEFAULT_PLANNER_URL = "http://127.0.0.1:8000/plan";

exports.getinput = async (req, res, next) => {
    const { userid } = req.body;
    const user = await User.findbyId(userid);
    res.json({ user });
};

function serializeTripSummary(t) {
    return {
        _id: String(t._id),
        userid: t.userid,
        destination: t.destination,
        days: t.days,
        budget: t.budget,
        type: t.type,
        transport: t.transport,
        stay: t.stay,
        activities: t.activities,
        extra: t.extra,
        createdAt: t.createdAt ? t.createdAt.toISOString() : null,
    };
}

exports.listTrips = async (req, res, next) => {
    try {
        const trips = await Trip.findByUserId(req.params.userid);
        const user = await User.findbyId(req.params.userid);
        console.log("user is ", user);
        res.json({ trips: trips.map(serializeTripSummary), user });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};

exports.getTrip = async (req, res, next) => {
    try {
        const { tripId } = req.params;
        const { userid } = req.query;
        if (!tripId || !ObjectId.isValid(String(tripId))) {
            return res.status(400).json({ error: "Invalid trip id" });
        }
        const trip = await Trip.findById(tripId);
        if (!trip || String(trip.userid) !== String(userid)) {
            return res.status(404).json({ error: "Not found" });
        }
        const user = await User.findbyId(userid);
        res.json({
            user,
            trip: {
                ...serializeTripSummary(trip),
                final_trip_plan: trip.final_trip_plan,
            },
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};

exports.deleteTrip = async (req, res, next) => {
    try {
        const { tripId } = req.params;
        const { userid } = req.query;

        if (!tripId || !ObjectId.isValid(String(tripId))) {
            return res.status(400).json({ success: false, error: "Invalid trip id" });
        }

        if (!userid) {
            return res.status(400).json({ success: false, error: "Missing userid" });
        }

        const deleted = await Trip.deleteByIdForUser(tripId, userid);
        if (!deleted) {
            return res.status(404).json({ success: false, error: "Trip not found" });
        }

        return res.json({ success: true });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, error: e.message });
    }
};

exports.trip = async (req, res, next) => {
    const data = req.body;
    console.log("trip data is", data);

    const plannerUrl = process.env.TRIP_PLANNER_URL || DEFAULT_PLANNER_URL;

    const payload = {
        userid: String(data.userid),
        destination: data.destination,
        days: String(data.days),
        budget: String(data.budget),
        type: data.type,
        transport: data.transport || "Any",
        stay: data.stay || "Standard",
        activities: data.activities || "",
        extra: data.extra || "",
    };

    try {
        // NIM free-tier DeepSeek is slow (~1-2 min), so allow generous timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000);

        const aiRes = await fetch(plannerUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!aiRes.ok) {
            const errText = await aiRes.text();
            console.error("Planner error:", aiRes.status, errText);
            return res.status(502).json({
                success: false,
                error: errText || `Planner returned ${aiRes.status}`,
            });
        }

        const aiJson = await aiRes.json();
        if (!aiJson.final_trip_plan) {
            return res.status(502).json({
                success: false,
                error: "Planner response missing final_trip_plan",
            });
        }

        const insertedId = await Trip.create({
            ...data,
            final_trip_plan: aiJson.final_trip_plan,
        });

        return res.json({
            success: true,
            tripId: String(insertedId),
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            error: e.message || "Failed to generate trip",
        });
    }
};

exports.settings = async (req, res, next) => {
    const userid = req.params.id;
    const user = await User.findbyId(userid);
    res.json({user});
}