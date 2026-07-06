module.exports = (sequelize, DataTypes) => {
  const Config = sequelize.define("Config", {
     id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      policyLink: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      icEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      presidingOfficer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      externalMember: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      icMembers: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      hrContactName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hrContactEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passingScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 4,
      },
  }, {
    tableName: 'configs',
    timestamps: true,
  });

  return Config;
};
