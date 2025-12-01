module.exports = (sequelize, DataTypes) => {
    const ServiceRequest = sequelize.define('ServiceRequest', {
        details: { type: DataTypes.TEXT, allowNull: false },
        priority: { type: DataTypes.ENUM('Low', 'Medium', 'High'), defaultValue: 'Medium' },
        status: { 
            type: DataTypes.ENUM('Pending Triage', 'Assigned', 'Quoted', 'Converted', 'Rejected'),
            defaultValue: 'Pending Triage' 
        }
    });

    ServiceRequest.associate = (models) => {
        ServiceRequest.belongsTo(models.Client, { foreignKey: 'clientId', as: 'Client' });
        ServiceRequest.belongsTo(models.User, { foreignKey: 'agentId', as: 'AssignedAgent' });
        ServiceRequest.belongsTo(models.ServiceCategory, { foreignKey: 'categoryId', as: 'Category' });
        ServiceRequest.hasOne(models.Proposal, { foreignKey: 'requestId', as: 'Proposal' });
    };
    return ServiceRequest;
};