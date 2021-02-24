import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import LifeplanPageComponent from '../components/LIfeplanPageComponent'
import { RootState, fetchLifeplanData } from '../stores'

const mapStateToProps = (state: RootState) => {
  const { user, lifeplan } = state

  return {
    user,
    lifeplan
  }
}

const mapDispatchToProps = {
  fetchLifeplanData
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type Props = ConnectedProps<typeof connector>

const LifeplanPageContainer = (props: Props): JSX.Element => {
  useEffect(() => {
    props.fetchLifeplanData()
  }, [])

  return (
    <LifeplanPageComponent
      activities={props.lifeplan.data?.activities}
      stats={props.lifeplan.data?.count}
    />
  )
}

export default connector(LifeplanPageContainer)