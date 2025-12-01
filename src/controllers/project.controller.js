const db = require("../models");
const Project = db.Project;
const ProjectAsset = db.ProjectAsset;

// List Projects (Filtered by Role)
exports.getProjects = async (req, res, next) => {
    try {
        let where = {};
        if (req.user.role === 'Client') {
            where.clientId = req.user.ClientProfile?.id; 
            // Note: Ensure User->Client association is loaded or use req.user.ClientProfile.id logic
        } else if (req.user.role === 'Agent') {
            where.agentId = req.user.id;
        }
        
        // If Admin, empty where clause (sees all)

        const projects = await Project.findAll({ 
            where,
            include: ['Client', 'Request', 'Agent'] 
        });
        res.json(projects);
    } catch (error) { next(error); }
};

// Update Project Status
exports.updateProjectStatus = async (req, res, next) => {
    try {
        // Add logic to check if user owns project if needed
        await Project.update(req.body, { where: { id: req.params.id } });
        res.json({ message: "Project Updated" });
    } catch (error) { next(error); }
};

// Upload Asset
exports.uploadAsset = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const projectId = req.params.id;
        const type = req.query.type || 'ClientAsset'; // 'ClientAsset' or 'Deliverable'

        const asset = await ProjectAsset.create({
            projectId,
            filePath: req.file.path,
            fileName: req.file.originalname,
            type
        });

        res.status(201).json(asset);
    } catch (error) { next(error); }
};

// Get Assets
exports.getAssets = async (req, res, next) => {
    try {
        const assets = await ProjectAsset.findAll({ 
            where: { projectId: req.params.id } 
        });
        res.json(assets);
    } catch (error) { next(error); }
};