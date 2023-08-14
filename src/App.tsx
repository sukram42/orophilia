import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { Mountains, supabase } from './supabaseClient';
import { Database } from './app/supabase';
import { Button } from 'antd';



function App() {
  const [mountains, setMountains] = useState<Array<Mountains>>([])
  const  [ user, setUser ] = useState()
  useEffect(()=>{
    getMountains()
    getUser()
  },[])

  async function getUser(){
    const { data } = await supabase.auth.getUser()
    setUser(data)
    console.log(data)
  }

  //  Get Mountains
  async function getMountains(): Promise<void>{
    const { data } = await supabase.from("Mountains").select()
    setMountains(data!);
  }

  async function signUp(){
    let { data, error } = await supabase.auth.signUp({
      email: 'markus.boebel1+test@gmail.com',
      password: 'test123'
    })
  }
  async function logIn(){
      let { data, error } = await supabase.auth.signInWithPassword({
        email: 'markus.boebel1+test@gmail.com',
        password: 'test123'
      })
  }
  async function logOut(){
      let { data, error } = await supabase.auth.signOut()
  }

  return (
    <div className="App">
      <div className="navigation">
        <div>{mountains.map((m)=>(m.name))}</div>
        <div>
          <Button type="primary" onClick={signUp}>Sign up!</Button>
          <Button onClick={logIn}>Log In!</Button>
          <Button onClick={logOut}>Log Out!</Button>
        </div>
      </div>
    </div>
  );
}

export default App;