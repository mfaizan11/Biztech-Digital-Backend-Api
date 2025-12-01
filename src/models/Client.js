module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define('Client', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        companyName: { type: DataTypes.STRING },
        industry: { type: DataTypes.STRING },
        websiteUrl: { type: DataTypes.STRING },
        technicalVault: { type: DataTypes.TEXT } // Stores Encrypted String
    });

    Client.associate = (models) => {
        Client.belongsTo(models.User, { foreignKey: 'userId', as: 'User' });
        Client.hasMany(models.ServiceRequest, { foreignKey: 'clientId', as: 'Requests' });
        Client.hasMany(models.Project, { foreignKey: 'clientId', as: 'Projects' });
    };
    return Client;
};