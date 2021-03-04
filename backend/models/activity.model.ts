import { Model, ModelCtor, Sequelize } from 'sequelize/types'

const ActivityModel = (sequelize: Sequelize, DataTypes: any): ModelCtor<Model<any, any>> => {
  const Activity = sequelize.define('Activity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'unknown'
    },
    currentSize: {
      type: DataTypes.BIGINT,
    },
    totalSize: {
      type: DataTypes.BIGINT,
    },
    duration: {
      type: DataTypes.FLOAT,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    processedBy: {
      type: DataTypes.UUID,
      allowNull: true
    }
  })

  return Activity
}

export default ActivityModel