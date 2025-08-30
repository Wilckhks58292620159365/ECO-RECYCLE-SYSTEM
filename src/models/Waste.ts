// backend/src/models/Waste.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

export interface WasteAttributes {
  id: string;
  type: string;
  weight: number;
  userId: number;
}

export interface WasteCreationAttributes extends Optional<WasteAttributes, "id"> {}

class Waste extends Model<WasteAttributes, WasteCreationAttributes> implements WasteAttributes {
  public id!: string;
  public type!: string;
  public weight!: number;
  public userId!: number;
}

Waste.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: { type: DataTypes.STRING, allowNull: false },
    weight: { type: DataTypes.FLOAT, allowNull: false },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Wastes",
    modelName: "Waste",
  }
);

// العلاقات
Waste.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Waste, { foreignKey: "userId", as: "wastes" });

export default Waste;
