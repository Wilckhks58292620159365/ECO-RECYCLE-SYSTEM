import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'locations', timestamps: true })
export class Location extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  lat!: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  lng!: number;
}
