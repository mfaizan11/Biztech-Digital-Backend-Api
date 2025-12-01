module.exports = (sequelize, DataTypes) => {
    const Proposal = sequelize.define('Proposal', {
        status: { 
            type: DataTypes.ENUM('Draft', 'Sent', 'Accepted', 'Rejected'),
            defaultValue: 'Draft' 
        },
        totalAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
        pdfPath: { type: DataTypes.STRING }
    });

    Proposal.associate = (models) => {
        Proposal.belongsTo(models.ServiceRequest, { foreignKey: 'requestId', as: 'Request' });
        Proposal.belongsTo(models.User, { foreignKey: 'agentId', as: 'Agent' });
        Proposal.hasMany(models.ProposalLineItem, { foreignKey: 'proposalId', as: 'Items' });
    };
    return Proposal;
};