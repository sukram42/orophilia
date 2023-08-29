import React, { useEffect, useState } from 'react';
import './App.css';
import { Mountains, supabase } from './supabaseClient';

import { Button } from 'antd';


function App() {
  const [mountains, setMountains] = useState<Array<Mountains>>([])
  const  [ user, setUser ] = useState()
  useEffect(()=>{
    getMountains()
    getUser()
  },[])

  return (
    <div className="App">
      <div className="navigation">
        <div>{mountains.map((m)=>(m.name))}</div>
        <div>
          <Button type="primary" onClick={signUp}>Sign up!</Button>
        </div>
      </div>
    </div>
  );
}

export default App;