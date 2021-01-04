import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: ShadowRoot,
  storage
}

const peristedReducer = persistReducer(persistConfig, nbsReducer)