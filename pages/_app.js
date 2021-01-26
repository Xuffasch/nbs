import { Provider } from 'react-redux'
import { useStore } from '../store'
import '../styles/globals.css'

import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

export default function App({ Component, pageProps }) {
  const { store } = useStore(pageProps.initialReduxState)
  const persistor = persistStore(store, {}, function() {
    persistor.persist()
  })

  return (
    <Provider store={store}>
      <PersistGate loading={<div>loading</div>} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>   
    </Provider>
  )
}
