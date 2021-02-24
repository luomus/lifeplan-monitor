import { Model, ModelCtor, Sequelize } from 'sequelize/types'

const UserModel = (sequelize: Sequelize, DataTypes: any): ModelCtor<Model<any, any>> => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 25]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  return User
}

export default UserModel