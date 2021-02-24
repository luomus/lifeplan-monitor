import { Model, ModelCtor, Sequelize } from 'sequelize/types'

const TokenModel = (sequelize: Sequelize, DataTypes: any): ModelCtor<Model<any, any>> => {
  const Token = sequelize.define('Token', {
    tokenname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 25]
      }
    },
  })

  return Token
}

export default TokenModel