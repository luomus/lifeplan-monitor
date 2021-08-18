import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store, persistor } from './stores'
import App from './App'
import { PersistGate } from 'redux-persist/integration/react'
import { Spinner } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Spinner animation={'border'} variant={'primary'}></Spinner>} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)