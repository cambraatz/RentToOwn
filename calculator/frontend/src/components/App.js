//import './App.css';
import '../../static/css/App.css';
import InputManager from './InputManager';
import Calculator from '../views/Calculator';
import Welcome from '../views/Welcome';
import HomePage from '../components/HomePage';
//import NavBar from './NavBar';
import React, { Component } from "react";
import { createRoot } from "react-dom/client";
//import axios from "axios";
import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';

const container = document.getElementById('app');
const root = createRoot(container);

//const userId = uuidv4();
//alert(userId);

function App() {
  const [cookies, setCookie] = useCookies(['user']);
  //alert(cookies.user);
  if(cookies.user === undefined) {
    const userId = uuidv4();
    setCookie('user', userId);
    /*document.cookie = `user=${userId}`*/
  }
  //alert(cookies.user);
  //alert(document.cookie);
  return (
    <div>
      <HomePage user_id={cookies.user} />
      {/* <NavBar />
      <Welcome />
      <Calculator />
      <InputManager />*/}
    </div>
    
  );
}

root.render(<App />)
export default App;
