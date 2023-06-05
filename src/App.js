import { Amplify } from "aws-amplify"
import { withAuthenticator } from "@aws-amplify/ui-react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./views/Home"
import Stream, { loader as streamLoader } from "./views/Stream"

import awsconfig from "./aws-exports"

import "@aws-amplify/ui-react/styles.css"
import "./App.css"
import { useMemo } from "react"
import Watch from "./views/Watch"

Amplify.configure(awsconfig)

function App({ signOut, user }) {
  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: "/",
          element: <Home user={user} signOut={signOut} />,
        },
        {
          path: "/stream/:channel_name",
          element: <Stream user={user} signOut={signOut} />,
          loader: streamLoader,
        },
        {
          path: "/watch/:channel_name",
          element: <Watch user={user} signOut={signOut} />,
          loader: streamLoader,
        },
      ]),
    [user, signOut]
  )
  console.log(user)
  return <RouterProvider router={router} />
}

export default withAuthenticator(App)
