import { Provider } from 'react-redux'
import { useStore } from '../store'
import '../styles/globals.css'

import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { useEffect } from 'react'
import { Workbox } from 'workbox-window'

export default function App({ Component, pageProps }) {
  const {store} = useStore(pageProps.initialReduxState)
  const persistor = persistStore(store, {}, function() {
    persistor.persist()
  })

  useEffect( () => {
     if ("serviceWorker" in navigator) {
      // window.addEventListener("load", function() {
      //   navigator.serviceWorker.register("/sw.js").then(
      //     function(registration) {
      //       console.log("Service Worker registration succeeded with scope: ", registration.scope);
      //     },
      //     function(err) {
      //       console.log("Service Worker registration failed: ", err);
      //     }
      //   ); 
      // });
      
      const wb = new Workbox("sw.js", { scope : "/" });
      wb.register();
     }

    //  let ImageLoader = new Worker("../workers/imageWorker.js");
    //  ImageLoader.postMessage("Hello World !")
  }, [])

  return (
    <Provider store={store}>
      <PersistGate loading={<div>loading</div>} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>   
    </Provider>
  )
}
