module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
        globalStatus: { 
            type: DataTypes.ENUM('Pending', 'In Progress', 'Testing', 'Delivered'),
            defaultValue: 'Pending' 
        },
        progressPercent: { type: DataTypes.INTEGER, defaultValue: 0 },
        ecd: { type: DataTypes.DATEONLY }, // Estimated Completion Date
    });

    Project.associate = (models) => {
        Project.belongsTo(models.ServiceRequest, { foreignKey: 'requestId', as: 'Request' });
        Project.belongsTo(models.Client, { foreignKey: 'clientId', as: 'Client' });
        Project.belongsTo(models.User, { foreignKey: 'agentId', as: 'Agent' });
        Project.hasMany(models.ProjectAsset, { foreignKey: 'projectId', as: 'Assets' });
    };
    return Project;
};