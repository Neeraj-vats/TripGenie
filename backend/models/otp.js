const {ObjectId} = require("mongodb");
const {getdb} = require("../utils/databaseUtil");
const bcrypt = require("bcryptjs");

module.exports = class OTP {
    constructor(userId, otp, expiresAt) {
        this.userId = userId;
        this.otp = otp;
        this.expiresAt = expiresAt;
        this.createdAt = new Date();
    }

    async save() {
        const db = getdb();
        // Hash OTP before saving
        this.otp = await bcrypt.hash(this.otp.toString(), 10);
        return db.collection("otps").insertOne(this);
    }

    static async findValidOTP(userId, otp) {
        const db = getdb();
        const otps = await db.collection("otps").find({
            userId: new ObjectId(userId),
            expiresAt: { $gt: new Date() }
        }).toArray();

        // Check each OTP
        for (const otpDoc of otps) {
            const isValid = await bcrypt.compare(otp.toString(), otpDoc.otp);
            if (isValid) {
                // Delete used OTP
                await db.collection("otps").deleteOne({_id: otpDoc._id});
                return true;
            }
        }
        return false;
    }

    static async deleteExpiredOTPs() {
        const db = getdb();
        return db.collection("otps").deleteMany({
            expiresAt: { $lt: new Date() }
        });
    }
};