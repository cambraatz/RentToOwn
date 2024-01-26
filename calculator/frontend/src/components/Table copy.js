import React, { useState, useEffect, Component } from "react";
import Button from '@mui/material/Button';
import NavBar from '../components/Navbar';

const Table = (props) => {

    const [purchasePriceTest, setPurchasePriceTest] = useState(500000);
    const [apartmentRentTest, setApartmentRentTest] = useState(3000);
    const [mcfTable, setMCFTable] = useState();
    const [mcfuTable, setMCFUTable] = useState();
    const [mcflTable, setMCFLTable] = useState();

    
    const getData = (e) => {
        fetch("/api/getdata" + "?user_id=" + props.user_id)
            .then((response) => response.json())
            .then((data) => {
                setPurchasePriceTest(data.purchase_price)
                setApartmentRentTest(data.apartment_rent)
                setMCFTable(data.mcf_table)
                setMCFUTable(data.mcfu_table)
                setMCFLTable(data.mcfl_table)
            });
    }
    
    /*
    const getData = (e) => {
        fetch("/api/getdata" + "?user_id=" + props.user_id)
            .then((response) => response.json())
            .then((data) => alert(data));
    }
    */
    return(
        <div>
            <NavBar />
            <div>
                <p>user_id: {props.user_id}</p>
                <p>purchase_price: {purchasePriceTest}</p>
                <p>apartment_rent: {apartmentRentTest}</p>
                <div id="MCF_Table_Div">
                    <p>Monthly Rent Cash Flow:</p>
                    <div id="MCF_Table" dangerouslySetInnerHTML={{ __html: mcfTable}}/>
                    <p>Monthly Unlevered Owner Cash Flow:</p>
                    <div id="MCF_Table" dangerouslySetInnerHTML={{ __html: mcfuTable}}/>
                    <p>Monthly Levered Owner Cash Flow:</p>
                    <div id="MCF_Table" dangerouslySetInnerHTML={{ __html: mcflTable}}/>
                </div>
                <Button type="submit" variant="contained" id="submitButton" onClick={getData}>Update</Button>
            </div>
        </div>
    )
};

export default Table;