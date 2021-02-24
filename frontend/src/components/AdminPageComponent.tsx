import React from 'react'
import { Container } from 'react-bootstrap'
import { useFieldType } from '../hooks/fieldHook'
import { TokenReducer } from '../stores'
import TokenFormComponent from './TokenFormComponent'
import TokenModalComponent from './TokenModalComponent'
import TokenTableComponent from './TokenTabletComponent'

interface Props {
  apiToken: TokenReducer,
  token: string,
  setToken: (token: string) => void,
  tokenField: useFieldType,
  newTokenHandler: (event: React.FormEvent<HTMLFormElement>) => void,
  deleteTokenHandler: (id: number) => void
}

const AdminPageComponent = (props: Props): JSX.Element => {
  return (
    <Container>
      <TokenFormComponent loading={props.apiToken.loading} tokenField={props.tokenField} newTokenHandler={props.newTokenHandler}/>
      <TokenTableComponent tokens={props.apiToken.tokens} deleletionHandler={props.deleteTokenHandler}/>
      <TokenModalComponent token={props.token} setToken={props.setToken}/>
    </Container>
  )
}

export default AdminPageComponent