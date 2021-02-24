import { Request, Response } from 'express'
import db from '../models'
import jwt from 'jsonwebtoken'

export const getTokens = async (req: Request, res: Response): Promise<void> => {
  const tokens = await db.Token.findAll({
    attributes: ['id', 'tokenname']
  })

  res.status(200).send(tokens.map((token: any) => token.toJSON()))
}

export const addToken = async (req: Request, res: Response): Promise<void> => {
  const secret = process.env.MONITOR_SECRET

  if (!secret) {
    console.error('Unable to locate secret environmental variable.')
    throw new Error('Token signing error')
  }

  const token = await db.Token.create(req.body)

  const apiToken = jwt.sign(
    {
      id: token.id,
      tokenname: token.tokenname,
    },
    secret
  )

  res.status(200).send({
    ...token.toJSON(),
    token: apiToken
  })
}

export const deleteTokenById = async (req: Request, res: Response): Promise<void> => {
  await db.Token.destroy({
    where: {
      id: req.params.id
    }
  })

  res.status(204).send()
}