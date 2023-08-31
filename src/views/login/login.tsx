import { Button } from "antd"
import { supabase } from "../../supabaseClient"
import { useState, useEffect, useMemo } from "react"
import { Navigate } from "react-router-dom"
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Login() {
    const [user, setUser] = useState()
    useEffect(() => {
        getUser()
    }, [])

    async function getUser() {
        const { data } = await supabase.auth.getUser()
        setUser(data.user)
        console.log("USER", data)
    }


    async function signUp() {
        let { data, error } = await supabase.auth.signUp({
            email: 'markus.boebel1+test@gmail.com',
            password: 'test123'
        })
    }
    async function logIn() {
        let { data, error } = await supabase.auth.signInWithPassword({
            email: 'markus.boebel1+test@gmail.com',
            password: 'test123'
        })
        setUser(data.user)
    }
    return (
        <div className="App">
            <div>
                {user ? <Navigate to="/"></Navigate> : ""}
            </div>
            <div className="navigation">
                <div>
                    <Button type="primary" onClick={signUp}>Sign up!</Button>
                    <Button onClick={logIn}>Log In!</Button>
                </div>
            </div>
        </div>
    );
}
