const db = require('../models');
// const { Sequelize } = require("sequelize");
const { Op, Sequelize } = require("sequelize");
// const { OAuth2Client } = require("google-auth-library");
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.findAll = async (req, res) => {
    try {
        const where = {};

        if (req.query.completedAt === "notnull") {
            where.completedAt = {
                [Op.not]: null,
            };
        }

        const users = await db.poshTrainings.findAll({
            where,
        });

        return res.status(200).send({
            success: true,
            message: 'users fetched successfully',
            data: users
        });

    } catch (error) {
        console.error('Error fetching users:', error);

        return res.status(500).send({
            success: false,
            message: 'Internal server error' + error.message
        });
    }
};

exports.create = async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Get latest training of this employee
        const latestTraining = await db.poshTrainings.findOne({
            where: { email: req.body.email },
            order: [["createdAt", "DESC"]]
        });

        // User has an unfinished training -> continue it
        if (latestTraining && !latestTraining.quizCompleted) {

            const ipAddress =
                req.headers["x-forwarded-for"]?.split(",")[0] ||
                req.socket.remoteAddress ||
                req.ip;

            await latestTraining.update({
                employeeId: req.body.employeeId,
                name: req.body.name,
                department: req.body.department,
                role: req.body.role,
                city: req.body.city,
                ipAddress
            });

            return res.status(200).json({
                success: true,
                message: "Continuing existing training.",
                data: latestTraining
            });
        }

        // User passed within last 6 months
        if ( latestTraining && latestTraining.quizCompleted && latestTraining.quizScore >= 4 && latestTraining.completedAt &&
            new Date(latestTraining.completedAt) >= sixMonthsAgo ) 
            {
                return res.status(400).json({
                    success: false, message: "You have already completed the training successfully. You can retake it after 6 months."
                });
            }

        // Otherwise create a new training
        const ipAddress =
            req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.socket.remoteAddress ||
            req.ip;

        const user = await db.poshTrainings.create({
            employeeId: req.body.employeeId,
            name: req.body.name,
            email: req.body.email,
            department: req.body.department,
            role: req.body.role,
            city: req.body.city,

            isRegistered: true,
            startedAt: new Date(),

            ipAddress
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: user
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.completeTraining = async (req, res) => {
    try {
        await db.poshTrainings.update(
            {
                quizCompleted: true,
                quizScore: req.body.quizScore,
                acknowledged: req.body.acknowledged,
                acknowledgedAt: req.body.acknowledgedAt,
                completedAt: req.body.completedAt
            },
            {
                where: { id: req.params.id }
            }
        );

        return res.json({ success: true });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });

    }

};

exports.login = async (req, res) => {
    try {
        const { email, employeeId, loginType } = req.body;

        const user = await db.poshTrainings.findOne({
            where: { email, employeeId },
            order: [["id", "DESC"]],
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Employee ID",
            });
        }

        const data = user.toJSON();

        let mustRetakeTraining = false;

        // Never completed training
        if (!data.completedAt) {
            mustRetakeTraining = true;
        } else {
            const completed = new Date(data.completedAt);
            const today = new Date();

            const monthsSinceTraining =
                (today.getFullYear() - completed.getFullYear()) * 12 +
                (today.getMonth() - completed.getMonth());

            // Retake if training is 6+ months old OR quiz failed
            mustRetakeTraining =
                monthsSinceTraining >= 6 || Number(data.quizScore || 0) < 4;

            console.log({
                monthsSinceTraining,
                quizScore: data.quizScore,
                mustRetakeTraining,
            });
        }

        data.mustRetakeTraining = mustRetakeTraining;

        return res.json({
            success: true,
            message: "Login successful",
            data,
            // isUserLogin: loginType === "user" ? true : false, // Mark this user as the one who logged in
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.findOneByEmail = async (req, res) => {
    try {
        const users = await db.poshTrainings.findAll({ 
            where: { email: req.params.email },
            order: [["id", "ASC"]]
            });

        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const updatedUsers = users.map(user => {
            const data = user.toJSON();
            const today = new Date();

            let monthsSinceTraining = 0;
            if (data.completedAt) {
                const completed = new Date(data.completedAt);

                monthsSinceTraining =
                    (today.getFullYear() - completed.getFullYear()) * 12 +
                    (today.getMonth() - completed.getMonth());
            }
            data.mustRetakeTraining = !data.completedAt || monthsSinceTraining >= 6 || data.quizScore < 4;
            data.isUserLogin = true; // Mark this user as the one who logged in
            return data;
        });
        return res.status(200).json({ success: true, data: updatedUsers });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};


// exports.googleLogin = async (req, res) => {
//     try {
//         const { credential } = req.body;
//         const ticket = await client.verifyIdToken({
//             idToken: credential,
//             audience: process.env.GOOGLE_CLIENT_ID
//         });

//         const payload = ticket.getPayload();
//         const email = payload.email;
//         const name = payload.name;
//         const ipAddress =
//                 req.headers["x-forwarded-for"]?.split(",")[0] ||
//                 req.socket.remoteAddress ||
//                 req.ip;
//         console.log("ipAddress===========",ipAddress);
//         let user = await db.poshTrainings.findOne({
//             where: { email },
//             order: [["completedAt", "DESC"]]
//         });
//         if (!user) {
//             // return res.status(404).json({ success: false, message: "Employee not found." });
//             user = await db.poshTrainings.create({
//                 name,
//                 employeeId: `G-${Math.floor(Math.random() * 1000) .toString() .padStart(3, "0")}`,
//                 email,
//                 quizScore: 0,
//                 ipAddress,
//                 quizCompleted: false,
//                 acknowledged: false,
//             });
//         }
//         const data = user.toJSON();

//         let mustRetakeTraining = false;

//         // Never completed training
//         if (!data.completedAt) {
//             mustRetakeTraining = true;
//         } else {
//             const completed = new Date(data.completedAt);
//             const today = new Date();

//             const monthsSinceTraining =
//                 (today.getFullYear() - completed.getFullYear()) * 12 +
//                 (today.getMonth() - completed.getMonth());

//             // Retake if training is 6+ months old OR quiz failed
//             mustRetakeTraining =
//                 monthsSinceTraining >= 6 || Number(data.quizScore || 0) < 4;

//             console.log({
//                 monthsSinceTraining,
//                 quizScore: data.quizScore,
//                 mustRetakeTraining,
//             });
//         }

//         data.mustRetakeTraining = mustRetakeTraining;

//         return res.json({ success: true, data, //isUserLogin: true 

//         });

//     } catch (err) {
//         console.error("Google login error:", err);
//         return res.status(500).json({
//             success: false,
//             message: err.message
//         });

//     }

// };

exports.findOneByEmployeeId = async (req, res) => {
    try {
        const training = await db.poshTrainings.findOne({ where: { employeeId: req.params.employeeId } });
        // if (!employee) {
        //     return res.status(404).json({ success: false, message: "Employee not found" });
        // }
        // res.json({ success: true, data: employee });
        if (!training) {
            const employee = await db.users.findOne({
            where: {
                id: req.params.employeeId,
            },
            attributes: [
                ["id", "employeeId"],
                "name",
                "email",
                ["technology", "department"],
                ["designation","role"],
                [
                Sequelize.literal(`
                    CASE
                    WHEN LOWER(location) LIKE '%delhi%' THEN 'Delhi'
                    WHEN LOWER(location) LIKE '%usa%' THEN 'USA'
                    ELSE 'Gurgaon'
                    END
                `),
                "city",
                ],
                [
                Sequelize.literal(`
                    CASE
                    WHEN role NOT IN (0, 1) THEN TRUE
                    ELSE FALSE
                    END
                `),
                "isUserLogin",
                ],
            ],
            });
            return res.json({ success: true, exists: false, data: employee });
        }
        else{
            return res.json({ success: true, exists: true, data: training });
        }

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};