import { Sequelize, DataTypes } from 'sequelize'
import InstanceModel from './instance.model'
import ActivityModel from './activity.model'
import UserModel from './user.model'
import TokenModel from './token.model'
import InstanceActivityModel from './instanceactivty.model'

const sequelize = new Sequelize(
  process.env.MONITOR_DB_NAME || '',
  process.env.MONITOR_DB_USER || '',
  process.env.MONITOR_DB_PASSWORD || '',
  {
    host: process.env.MONITOR_DB_HOST || '',
    dialect: 'mysql'
  }
)

const db: Record<string, any> = {}

db.sequelize = sequelize

db.Token = TokenModel(sequelize, DataTypes)
db.User = UserModel(sequelize, DataTypes)
db.Instance = InstanceModel(sequelize, DataTypes)
db.Activity = ActivityModel(sequelize, DataTypes)
db.InstanceActivity = InstanceActivityModel(sequelize, DataTypes)

db.Instance.Activity = db.Instance.belongsToMany(
  db.Activity,
  {
    through: db.InstanceActivity,
    as: 'activities',
    foreignKey: 'InstanceId',
    otherKey: 'ActivityId'
  }
)


db.Activity.Instance = db.Activity.belongsToMany(
  db.Instance,
  {
    through: db.InstanceActivity,
    as: 'instances',
    foreignKey: 'ActivityId',
    otherKey: 'InstanceId'
  }
)

export default db