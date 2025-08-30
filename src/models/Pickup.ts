import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface PickupAttributes {
  id: number;
  userId: number;
  description: string;
  quantity: number;
  date: string; // ISO string
  type: string; // نوع المخلفات (مثلاً "بلاستيك")
  image: string | null;
    wasteType?: string; 
  status: "pending" | "confirmed" | "rejected";
  points: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type PickupCreationAttributes = Optional<
  PickupAttributes,
  "id" | "image" | "status" | "points" | "createdAt" | "updatedAt"
>;

class Pickup
  extends Model<PickupAttributes, PickupCreationAttributes>
  implements PickupAttributes
{
  public id!: number;
  public userId!: number;
  public description!: string;
  public wasteType?:string;
  public quantity!: number;
  public date!: string;
  public type!: string;
  public image!: string | null;
  public status!: "pending" | "confirmed" | "rejected";
  public points!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Pickup.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
    date: { type: DataTypes.STRING(32), allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }, // جديد
    image: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM("pending", "confirmed"), defaultValue: "pending" },
    points: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 }, // جديد
    wasteType: { type: DataTypes.STRING, allowNull: true },
    
  },
  {
    sequelize,
    modelName: "Pickup",
    tableName: "pickups",
  }
  
);

export default Pickup;
