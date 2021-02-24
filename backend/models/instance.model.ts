import { Model, ModelCtor, Sequelize } from 'sequelize/types'

const InstanceModel = (sequelize: Sequelize, DataTypes: any ): ModelCtor<Model<any, any>> => {
  const Instance = sequelize.define('Instance', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    }
  })

  return  Instance
}

export default InstanceModel