import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useStore } from "react-redux";
import { useEffect, useState } from "react";

export default function RequireAuth({ children }) {
  const [stateUser, setUser] = useState()
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      console.log("User", user)
    }

    console.log(stateUser)
    getUser()
    console.log(stateUser)
  }, [])
  return children
  // return (stateUser? children : <Navigate to="/login" />)

}