import React from 'react';
import NavBar from '../components/Navbar';
import InputManager from '../components/InputManager';
import Table from "../components/Table";
import Drawer from '../components/Drawer';
import { useCookies } from "react-cookie";

const Calculator = (props) => {
    return (
        <div id='calculator_view'>
            <NavBar />
            <InputManager user_id={props.user_id} />
            <Table />
        </div>
    )
}

export default Calculator;

// <Drawer />