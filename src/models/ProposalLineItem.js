module.exports = (sequelize, DataTypes) => {
    const ProposalLineItem = sequelize.define('ProposalLineItem', {
        description: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
    });
    ProposalLineItem.associate = (models) => {
        ProposalLineItem.belongsTo(models.Proposal, { foreignKey: 'proposalId' });
    };
    return ProposalLineItem;
};