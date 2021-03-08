import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import AdminPageComponent from '../components/AdminPageComponent'
import { ModalParamsType } from '../components/ConfirmationModalComponent'
import LoadingOverlayComponent from '../components/LoadingOverlayComponent'
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
  const [ show, setShow ] = useState<boolean>(false)
  const [ deletionTarger, setDeletionTarget ] = useState<number | null>(null)

  const newTokenHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const newToken = await props.createToken(tokenField.value)

    if (newToken) {
      setToken(newToken)
    }

    tokenField.reset()
  }

  useEffect(() => {
    props.fetchTokens()
  }, [])

  const onDeleteButton = (id: number) => {
    setDeletionTarget(id)
    setShow(true)
  }

  const onDelete = () => {
    props.removeToken(deletionTarger)
    setDeletionTarget(null)
    setShow(false)
  }

  const deleteModalParams: ModalParamsType = {
    onLeft: () => onDelete(),
    onRight: () => setShow(false),
    leftLabel: 'Delete',
    rightLabel: 'Cancel',
    leftVariant: 'danger',
    rightVariant: 'primary',
    label: 'Delete Token',
    body: 'Are you certain that you wish to delete th api token?',
    show: show
  }

  return (
    <LoadingOverlayComponent loading={props.apiToken.loading}>
      <AdminPageComponent
        apiToken={props.apiToken}
        token={token}
        setToken={setToken}
        tokenField={tokenField}
        newTokenHandler={newTokenHandler}
        deleteTokenHandler={onDeleteButton}
        deleteModalParams={deleteModalParams}
      />
    </LoadingOverlayComponent>
  )
}

export default connector(AdminPageContainer)