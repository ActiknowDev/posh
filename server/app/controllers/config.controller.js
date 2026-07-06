const db = require('../models');
const { Op } = require("sequelize");

exports.findAll = async (req, res) => {
    try {
        const configs = await db.config.findAll();

        return res.status(200).send({
            success: true,
            message: 'configs fetched successfully',
            data: configs
        });

    } catch (error) {
        console.error('Error fetching configs:', error);

        return res.status(500).send({
            success: false,
            message: 'Internal server error' + error.message
        });
    }
};
exports.saveConfigs = async (req, res) => {
    try {
        const {
            companyName,
            presidingOfficer,
            externalMember,
            icMembers,
            icEmail,
            hrContactName,
            hrContactEmail,
            policyLink,
            passingScore
        } = req.body;

        let config = await db.config.findOne();

        if (config) {
            await config.update({
                companyName,
                presidingOfficer,
                externalMember,
                icMembers,
                icEmail,
                hrContactName,
                hrContactEmail,
                policyLink,
                passingScore
            });

            return res.status(200).json({
                success: true,
                message: "Configuration updated successfully.",
                data: config
            });
        }

        config = await db.config.create({
            companyName,
            presidingOfficer,
            externalMember,
            icMembers,
            icEmail,
            hrContactName,
            hrContactEmail,
            policyLink,
            passingScore
        });

        return res.status(201).json({
            success: true,
            message: "Configuration created successfully.",
            data: config
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};