import React from "react";
import Welcome from '../views/Welcome.js';
import Calculator from "../views/Calculator.js";
import Tutorial from "../views/Tutorial.js";
import Table from "./Table.js";

import { 
    BrowserRouter as Router, 
    Switch, 
    Route,
    Routes,
    Link, 
    Redirect,
} from "react-router-dom";


const HomePage = (props) => {
    return (
        <Router>
            <Routes>
                <Route exact path='/' element={<Welcome />} />
                <Route path='/Welcome' element={<Welcome />} />
                <Route path='/Calculator' element={<Calculator user_id={props.user_id} />} />
                <Route path='/Tutorial' element={<Tutorial />} />
                <Route path='/datafield/:user_id' element={<Table user_id={props.user_id} />} />
                {/*<Route path='/Support' element={<ComputerScience />} /> */}
            </Routes>
        </Router>
    )
}

export default HomePage;