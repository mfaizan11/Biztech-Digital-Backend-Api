const db = require("../models");
const { encrypt, decrypt } = require("../services/crypto.service");
const Client = db.Client;

exports.getMyProfile = async (req, res, next) => {
    try {
        const profile = await Client.findOne({ where: { userId: req.user.id } });
        if (!profile) return res.status(404).json({ message: "Profile not found" });

        // Decrypt vault before sending
        if (profile.technicalVault) {
            profile.technicalVault = decrypt(profile.technicalVault);
        }
        res.json(profile);
    } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const { industry, websiteUrl, technicalVault } = req.body;
        const updateData = { industry, websiteUrl };
        
        // Encrypt vault if provided
        if (technicalVault) {
            updateData.technicalVault = encrypt(technicalVault);
        }

        await Client.update(updateData, { where: { userId: req.user.id } });
        res.json({ message: "Profile Updated" });
    } catch (error) { next(error); }
};