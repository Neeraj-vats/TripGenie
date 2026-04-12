const { ObjectId } = require("mongodb");
const { getdb } = require("../utils/databaseUtil");

class Trip {
    static async create({
        userid,
        destination,
        days,
        budget,
        type,
        transport,
        stay,
        activities,
        extra,
        final_trip_plan,
    }) {
        const db = getdb();
        const doc = {
            userid: String(userid),
            destination: String(destination),
            days: String(days),
            budget: String(budget),
            type: String(type),
            transport: String(transport || ""),
            stay: String(stay || ""),
            activities: String(activities || ""),
            extra: String(extra || ""),
            final_trip_plan,
            createdAt: new Date(),
        };
        const r = await db.collection("trips").insertOne(doc);
        return r.insertedId;
    }

    static async findByUserId(userid) {
        const db = getdb();
        return db
            .collection("trips")
            .find(
                { userid: String(userid) },
                { projection: { final_trip_plan: 0 } }
            )
            .sort({ createdAt: -1 })
            .toArray();
    }

    static async findById(id) {
        const db = getdb();
        return db.collection("trips").findOne({ _id: new ObjectId(String(id)) });
    }
}

module.exports = Trip;
