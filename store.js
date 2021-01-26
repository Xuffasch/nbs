import { useMemo } from 'react'
import { createStore, combineReducers } from 'redux'

import { persistReducer } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'redux-persist/lib/storage'

import * as actions from './actions'

let store

const initialState = {
  altMode: true,
  count: 15,
  cart: [],
  activate_sw: true
}

const nbsReducer = function(state = initialState, action) {
  switch (action.type) {
    case actions.CHANGE_MODE:
      console.log("change_mode called")
      return { 
        ...state, 
        altMode: !state.altMode, 
      };
    case actions.ADD_COUNTER:
      console.log("add_counter called")
      return {
        ...state,
        count: state.count + 1
      };
    case actions.DECREASE_COUNTER:
      console.log("decrease_counter called")
      return {
        ...state,
        count: state.count - 1
      };
    case actions.USE_SERVICE_WORKER:
      console.log("service worker is switched ", !state.activate_sw ? "off" : "on");
      return {
        ...state,
        activate_sw: !state.activate_sw
      }
    case actions.RESET_STORE:
      storage.removeItem('persist:primary');
      return {
        ...initialState
      }
    default:
      return {
        ...state
      }
  }
}

const appReducer = combineReducers({
  nbsReducer,
})

const rootReducer = (state, action) => {
  if (action.type === actions.RESET_STORE) {
    storage.removeItem('persist:primary');
    
    state = undefined
  }
  
  return appReducer(state, action)
}

const persistConfig = {
  key: 'primary',
  storage,
  stateReconciler: autoMergeLevel2
}

const persistedReducer = persistReducer(persistConfig, nbsReducer)
// const persistedReducer = persistReducer(persistConfig, rootReducer)

function initStore(preloadedState = initialState) {
  return createStore(
    persistedReducer,
    preloadedState,
  )
}

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState)

  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState
    })

    store = undefined
  }

  /* For SSR and SSG */
  if (typeof window === 'undefined') return _store

  if (!store) store = _store

  return _store
}

export function useStore(initialState) {
  const store = useMemo( () => initializeStore(initialState), [initialState])
  
  return { store }
}