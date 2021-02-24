import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import AdminPageComponent from '../components/AdminPageComponent'
import useField from '../hooks/fieldHook'
import { createToken, fetchTokens, removeToken, RootState } from '../stores'

const mapStateToProps = (state: RootState) => {
  const { apiToken } = state

  return {
    apiToken
  }
}

const mapDispatchToProps = {
  fetchTokens,
  createToken,
  removeToken,
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type Props = ConnectedProps<typeof connector>

const AdminPageContainer = (props: Props): JSX.Element => {
  const tokenField = useField('text')
  const [ token, setToken ] = useState<string>('')

  const newTokenHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const newToken = await props.createToken(tokenField.value)

    if (newToken) {
      setToken(newToken)
    }

    tokenField.reset()
  }

  const deleteTokenHandler = (id: number) => {
    props.removeToken(id)
  }

  useEffect(() => {
    props.fetchTokens()
  }, [])

  return (
    <AdminPageComponent
      apiToken={props.apiToken}
      token={token}
      setToken={setToken}
      tokenField={tokenField}
      newTokenHandler={newTokenHandler}
      deleteTokenHandler={deleteTokenHandler}
    />
  )
}

export default connector(AdminPageContainer)