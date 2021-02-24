import { Model, ModelCtor, Sequelize } from 'sequelize/types'

const InstanceActivityModel = (sequelize: Sequelize, DataTypes: any ): ModelCtor<Model<any, any>> => {
  const InstanceActivity = sequelize.define('InstanceActivity', {
    InstanceId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    ActivityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  })

  return  InstanceActivity
}

export default InstanceActivityModel