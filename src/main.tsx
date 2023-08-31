import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import App from "./App"
import "./index.css"
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import Root from "./views/root/root"
import Home from "./views/home/home"
import Login from "./views/login/login"
import RequireAuth from "./app/AuthProvider"


async function getUser() {
  const { data } = await supabase.auth.getUser()
}

const auth = false

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RequireAuth><Home /></RequireAuth>}>
        {/* <Route path="/home" element={<Home />} /> */}
        {/* ... etc. */}
      </Route>
      <Route path="/login" element={<Login />} />
    </>
  )
);



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
