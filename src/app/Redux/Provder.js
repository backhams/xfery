"use client"
import React from 'react'
import { Provider } from 'react-redux'
import store from './Store'

export default function Provder({children}) {
  return (
    <Provider store={store}>
        {children}
    </Provider>
  )
}
