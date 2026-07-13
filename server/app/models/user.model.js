module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING(350),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    reporting_manager: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    team: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    designation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    technology: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    client_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    company_website_link: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    contact_person_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    country_code: {
      type: DataTypes.STRING(25),
      allowNull: true,
      defaultValue: "",
    },
    contact_no: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    el: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    cl: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    sl: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    lwp: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    pf_no: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    total_cl: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    total_sl: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    comp_off: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    emp_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    teamid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dol: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    doj: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    role_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    user_image: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "http://44.230.62.131/pma/img/Actiknow/actiknow2.png",
    },
    point_of_contact: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "",
    },
    level_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: "users",
    timestamps: true,
    createdAt: "created",
    updatedAt: "modified",
  });

  return User;
};