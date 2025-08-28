import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface PickupLocationAttributes {
  id: number;
  nameEn: string;
  nameAr: string;
  lat: number;
  lng: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type PickupLocationCreation = Optional<
  PickupLocationAttributes,
  "id" | "createdAt" | "updatedAt"
>;

class PickupLocation
  extends Model<PickupLocationAttributes, PickupLocationCreation>
  implements PickupLocationAttributes
{
  public id!: number;
  public nameEn!: string;
  public nameAr!: string;
  public lat!: number;
  public lng!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PickupLocation.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    nameEn: { type: DataTypes.STRING(200), allowNull: false },
    nameAr: { type: DataTypes.STRING(200), allowNull: false },
    lat: { type: DataTypes.FLOAT, allowNull: false },
    lng: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    sequelize,
    modelName: "PickupLocation",
    tableName: "locations",
  }
);

export default PickupLocation;