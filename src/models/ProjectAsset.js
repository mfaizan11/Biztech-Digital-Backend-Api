module.exports = (sequelize, DataTypes) => {
    const ProjectAsset = sequelize.define('ProjectAsset', {
        filePath: { type: DataTypes.STRING, allowNull: false },
        fileName: { type: DataTypes.STRING },
        type: { type: DataTypes.ENUM('ClientAsset', 'Deliverable'), defaultValue: 'ClientAsset' }
    });
    ProjectAsset.associate = (models) => {
        ProjectAsset.belongsTo(models.Project, { foreignKey: 'projectId' });
    };
    return ProjectAsset;
};