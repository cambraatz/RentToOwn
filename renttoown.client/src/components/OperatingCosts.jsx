import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
//import Header from '../components/Header';
import '../App.css';
import PercentSlider from './PercentSlider';
import tools_icon from "../assets/tools-icon.png";

/*
property_tax: 3000,
property_tax_rate: 0.6,
home_insurance: 3000,
home_insurance_rate: 0.6,
maintenance: 5000,
maintenance_rate: 1,
hoa_util: 104,
hoa_util_rate: 0.25,
*/

const OperatingCosts = (props) => {
    const handleSliderChange = props.onChange;
    const expandClick = props.onClick;
    const form = props.data;

    return(
        <>
        <div className="advanced" id="operating_costs" onClick={expandClick}>
            <img 
                src={tools_icon}
                alt=""
                id="bank_icon"
                className="menu_icons"
            />
            <h4>operating costs</h4>
        </div>
        <div className="bank_icon_content collapsible_content">
            <h4>property tax - annual</h4>
            <PercentSlider id="property_tax" id2="property_tax_rate"
                min="0"
                max="5"
                step="0.1"
                value={form.property_tax}
                value2={form.property_tax_rate}
                onChange={handleSliderChange}
            />
            <h4>home insurance - annual</h4>
            <PercentSlider id="home_insurance" id2="home_insurance_rate"
                min="0"
                max="5"
                step="0.1"
                value={form.home_insurance}
                value2={form.home_insurance_rate}
                onChange={handleSliderChange}
            />
            <h4>maintenance - annual</h4>
            <PercentSlider id="maintenance" id2="maintenance_rate"
                min="0"
                max="10"
                step="0.25"
                value={form.maintenance}
                value2={form.maintenance_rate}
                onChange={handleSliderChange}
            />
            <h4>hoa / utilities - monthly</h4>
            <PercentSlider id="hoa_util" id2="hoa_util_rate"
                min="0"
                max="5"
                step="0.1"
                value={form.hoa_util}
                value2={form.hoa_util_rate}
                onChange={handleSliderChange}
            />
        </div>
        </>
    )
}

export default OperatingCosts;