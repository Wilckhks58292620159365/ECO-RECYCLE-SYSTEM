// backend/src/models/User.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcryptjs";

export interface UserAttributes {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role: "user" | "admin";
  points: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id" | "role" | "points" | "active"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public role!: "user" | "admin";
  public points!: number;
  public active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  async checkPassword(plain: string) {
    return bcrypt.compare(plain, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("user", "admin"), allowNull: false, defaultValue: "user" },
    points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    tableName: "Users",
    modelName: "User",
    hooks: {
      beforeValidate: (user: User) => {
        if (user.email) user.email = user.email.trim().toLowerCase();
      },
      beforeCreate: async (user: User) => {
        if (user.password && !user.password.startsWith("$2")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password") && user.password && !user.password.startsWith("$2")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: {},
    },
  }
);

export default User;
