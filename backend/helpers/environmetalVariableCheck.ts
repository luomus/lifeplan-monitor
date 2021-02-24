const expectedKeys = [
  'MONITOR_DB_NAME',
  'MONITOR_SESSION_DB_NAME',
  'MONITOR_DB_USER',
  'MONITOR_DB_PASSWORD',
  'MONITOR_DB_HOST',
  'MONITOR_SECRET',
  'LIFEPLAN_API_URL',
  'LIFEPLAN_API_TOKEN',
  'MONITOR_COMPLETED_MAX_AGE',
  'MONITOR_PARTIAL_MAX_AGE',
  'MONITOR_FAILED_MAX_AGE',
  'MONITOR_INPROGRESS_MAX_AGE',
]

const environmentalVariableCheck = () => {
  const keys = Object.keys(process.env)
  let notFound = false

  expectedKeys.forEach((key: string) => {
    if (!keys.includes(key)) {
      console.error('Missing environmental variable: ', key)
      notFound = true
    }
  })

  if (notFound) {
    process.exit()
  }
}

export default environmentalVariableCheck