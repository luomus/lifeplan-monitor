import React from 'react'
import { Alert, Container } from 'react-bootstrap'
import { connect, ConnectedProps } from 'react-redux'
import { clearTokenError, clearMiddlesoftwareError, clearUserError, RootState } from '../stores'

const mapStateToProps = (state: RootState) => {
  const { apiToken, user, middlesoftware } = state

  return {
    apiToken,
    user,
    middlesoftware
  }
}

const mapDispatchToProps = {
  clearTokenError,
  clearMiddlesoftwareError,
  clearUserError
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type Props = ConnectedProps<typeof connector>

const ErrorComponent = (props: Props): JSX.Element => {
  const createError = (target): JSX.Element => {
    if (target.error) {
      return (
        <Alert key={target.key} variant={'danger'} onClose={target.clearError} dismissible style={{ width: '100%', padding: 10 }}>
          <Alert.Heading>{'Error'}</Alert.Heading>
          <p>{target.error}</p>
        </Alert>
      )
    }
  }

  const createErrorList = () => {
    const errorlist = [
      { key: 'token', error: props.apiToken.error, clearError: props.clearTokenError },
      { key: 'middlesoftware', error: props.middlesoftware.error, clearError: props.clearMiddlesoftwareError },
      { key: 'user', error: props.user.error, clearError: props.clearUserError }
    ]

    return (
      <Container>
        {errorlist.map(error => {
          return createError(error)
        })}
      </Container>
    )
  }

  return (
    <>
      {createErrorList()}
    </>
  )
}

export default connector(ErrorComponent)