import React from 'react';
import NavBar from '../components/NavBar';
import InputManager from '../components/InputManager';
import '../../static/css/App.css';
import '../../static/css/index.css';
import Table from "../components/Table";
import Drawer from '../components/Drawer';
import { useCookies } from "react-cookie";

const Calculator = (props) => {
    return (
        <div id='calculator_view'>
            <NavBar />
            <InputManager user_id={props.user_id} />
        </div>
    )
}

export default Calculator;

// <Drawer />
// <Table />