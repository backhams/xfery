
"use client"
import React from 'react'
import {SessionProvider} from 'next-auth/react'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { ThemeProvider } from 'next-themes';
import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import {Analytics} from "@vercel/analytics/react"

export default function Session({children,session}) {
  return ( 
    <>
    <SessionProvider session={session}>
      <ThemeProvider enableSystem={true}>
      {children}
      <ToastContainer />
      </ThemeProvider>
      <ProgressBar
          height="4px"
          color="red"
          options={{ showSpinner: false }}
          shallowRouting
          shallowNavigtion
        />
    </SessionProvider>
    <Analytics/>
    </>
  )
}
