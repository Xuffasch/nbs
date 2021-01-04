import { useMemo } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import * as actions from './actions'

let store

const initialState = {
  altMode: true,
  count: 15,
  cart: []
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
    default:
      return state
  }
}

const persistConfig = {
  key: 'primary',
  storage
}

const persistedReducer = persistReducer(persistConfig, nbsReducer)

function initStore(preloadedState = initialState) {
  return createStore(
    persistedReducer,
    preloadedState,
    composeWithDevTools(applyMiddleware())
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

  if (typeof window === 'undefined') return _store

  if (!store) store = _store

  return _store
}

export function useStore(initialState) {
  const store = useMemo( () => initializeStore(initialState), [initialState])
  
  return { store }
}