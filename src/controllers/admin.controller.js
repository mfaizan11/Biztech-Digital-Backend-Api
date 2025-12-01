const bcrypt = require("bcryptjs"); 
const db = require("../models");
const User = db.User;
const ServiceCategory = db.ServiceCategory;
const { sendAccountApproval } = require('../services/email.service');


exports.getPendingUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({ where: { status: 'Pending Approval' } });
        res.json(users);
    } catch (error) { next(error); }
};

exports.updateUserStatus = async (req, res, next) => {
    try {
        const { status } = req.body; 
        const user = await User.findByPk(req.params.id); 
        
        await User.update({ status }, { where: { id: req.params.id } });
        
        // Send Email using the new service function
        if (user && status === 'Active') {
            await sendAccountApproval(user.email, user.fullName);
        }

        res.json({ message: `User status updated to ${status}` });
    } catch (error) { next(error); }
};

exports.createCategory = async (req, res, next) => {
    try {
        const category = await ServiceCategory.create(req.body);
        res.status(201).json(category);
    } catch (error) { next(error); }
};

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await ServiceCategory.findAll();
        res.json(categories);
    } catch (error) { next(error); }
};

exports.createAgent = async (req, res, next) => {
    try {
        const { fullName, email, password, mobile } = req.body;

        // Check if user exists
        const exists = await User.findOne({ where: { email } });
        if (exists) return res.status(400).json({ message: "Email already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create Agent immediately as 'Active'
        const agent = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role: 'Agent',
            mobile,
            status: 'Active' // No approval needed since Admin created it
        });

        // Optional: Send email to Agent with credentials here

        res.status(201).json({ 
            message: "Agent created successfully.", 
            agent: { id: agent.id, email: agent.email, name: agent.fullName } 
        });
    } catch (error) { next(error); }
};