import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
//import Header from '../components/Header';
import '../App.css';
import Slider from './Slider';
import PercentSlider from './PercentSlider';
import sale_icon from "../assets/sale-icon.png";

/*
title_insur_disp: 0,
transfer_tax_disp: 0,
transfer_tax_disp_rate: 0,
broker_fee: 31880,
broker_rate: 5.5,
total_disposition: 31880,
*/

const DispositionCosts = (props) => {
    const handleSliderChange = props.onChange;
    const expandClick = props.onClick;
    const form = props.data;
    return(
        <>
        <div className="advanced" id="taxes_fees" onClick={expandClick}>
            <img 
                src={sale_icon}
                alt=""
                id="bank_icon"
                className="menu_icons"
            />
            <h4>disposition costs</h4>
        </div>
        <div className="bank_icon_content collapsible_content">
            <h4>title insurance</h4>
            <Slider id="title_insur_disp"
                min="0"
                max="5000"
                step="50"
                value={form.title_insur_disp}
                unit="$"
                onChange={handleSliderChange}
            />
            <h4>transfer tax</h4>
            <PercentSlider id="transfer_tax_disp" id2="transfer_tax_disp_rate"
                min="0"
                max="5"
                step="0.1"
                value={form.transfer_tax_disp}
                value2={form.transfer_tax_disp_rate}
                onChange={handleSliderChange}
            />
            <h4>brokerage fee</h4>
            <PercentSlider id="broker_fee" id2="broker_rate"
                min="0"
                max="12"
                step="0.1"
                value={form.broker_fee}
                value2={form.broker_rate}
                onChange={handleSliderChange}
            />
            <div id="input6">
                <h4>total disposition</h4>
                <div className="incrementerdiv">
                    <div>
                        <p>$</p>
                        <input className="box" type="number" name="quantity" value={form.total_disposition} onChange={handleSliderChange} disabled/>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default DispositionCosts;