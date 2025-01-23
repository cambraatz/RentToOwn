import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
//import Header from '../components/Header';
import '../App.css';
import Slider from '../components/Slider';
import bank_icon from "../assets/bank-icon.png";

/*
cap_gains_rate: 20.0,
federal_tax_rate: 35.0,
federal_tax_bool: true,
salt_limit: 10000,
salt_limit_bool: true,
rent_growth: 3.0,
home_price_appr: 3.0,
ret_inflation: 3.0,
other_inflation: 3.0,
*/

const troublshoot = (e) => {
    console.log(e.target);
}

const GeneralAssumptions = (props) => {
    const handleSliderChange = props.onChange;
    const expandClick = props.onClick;
    const form = props.data;
    return(
        <>
        <div className="advanced" id="taxes_fees" onClick={expandClick}>
            <img 
                src={bank_icon}
                alt=""
                id="bank_icon"
                className="menu_icons"
            />
            <h4>general assumptions</h4>
        </div>
        <div className="bank_icon_content collapsible_content" onClick={troublshoot}>
            <h4>capital gains rate (state + fed)</h4>
            <Slider id="capital_gains"
                min="0"
                max="50"
                step="0.1"
                value={form.cap_gains_rate}
                unit="%"
                onChange={handleSliderChange}
            />
            <h4>federal tax rate</h4>
            <Slider id="federal_tax"
                min="0"
                max="65"
                step="0.1"
                value={form.federal_tax_rate}
                unit="%"
                onChange={handleSliderChange}
            />
            <h4>salt limit</h4>
            <Slider id="salt_limit"
                min="0"
                max="20000"
                step="0.1"
                value={form.salt_limit}
                unit="$"
                onChange={handleSliderChange}
            />
            <h4>rent growth</h4>
            <Slider id="rent_growth"
                min="0"
                max="50"
                step="0.1"
                value={form.rent_growth}
                unit="%"
                onChange={handleSliderChange}
            />
            <h4>home appreciation</h4>
            <Slider id="home_appreciation"
                min="0"
                max="12"
                step="0.1"
                value={form.home_price_appr}
                unit="%"
                onChange={handleSliderChange}
            />
            <h4>ret inflation</h4>
            <Slider id="ret_inflation"
                min="0"
                max="12"
                step="0.1"
                value={form.ret_inflation}
                unit="%"
                onChange={handleSliderChange}
            />
            <h4>other inflation</h4>
            <Slider id="other_inflation" className="tail"
                min="0"
                max="12"
                step="0.1"
                value={form.other_inflation}
                unit="%"
                onChange={handleSliderChange}
            />
            <div className="tail"></div>
        </div>
        </>
    )
}

export default GeneralAssumptions;