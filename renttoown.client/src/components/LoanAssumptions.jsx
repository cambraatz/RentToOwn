import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
//import Header from '../components/Header';
import '../App.css';
import Slider from './Slider';
import PercentSlider from './PercentSlider';
import loan_icon from "../assets/loan-icon.png";

/*
max_loan_ltv: 787750,
max_loan_rate: 80,
desired_loan_ltv: 400000,
desired_loan_rate: 80,
loan_rate: 7,
loan_amortization: 30,
mortgage_insur: 5,
mortgage_insur_limit: 80,
mortgage_points: 4000,
mortgage_points_rate: 1
*/



const LoanAssumptions = (props) => {
    const handleSliderChange = props.onChange;
    const expandClick = props.onClick;
    const form = props.data;
    const max_loan_ltv_parsed = 787750;
    const zipcode = 80209;
    return(
        <>
        <div className="advanced" id="taxes_fees" onClick={expandClick}>
            <img 
                src={loan_icon}
                alt=""
                id="bank_icon"
                className="menu_icons"
            />
            <h4>loan assumptions</h4>
        </div>
        <div className="bank_icon_content collapsible_content">
            <div id="zipcode">
                <div id="zip">
                    <div>
                        <p>zipcode</p>
                    </div>
                    <input type="number" name="quantity" value={zipcode} onChange={handleSliderChange}/>
                </div>
            </div>
            <h4 className="non_slider_title">max loan ltv</h4>
            <div className="double_input">
                <div className="resultsval">
                    <div>
                    <p>$</p>
                    <input type="number" id="max_loan_ltv" name="max_loan_ltv" value={form.max_loan_ltv} onChange={handleSliderChange}/>
                    </div>
                </div>
                <div className="dlr_div">
                    <input type="number" id="max_loan_rate" name="max_loan_rate" value={form.max_loan_rate} onChange={handleSliderChange} disabled/>
                    <p>%</p>
                </div>
            </div>
            {/*
            <PercentSlider id="max_loan_ltv" id2="max_loan_rate"
                min="0"
                max="100"
                step="1"
                value={form.max_loan_ltv}
                value2={form.max_loan_rate}
                onChange={handleSliderChange}
            />
            <Slider id="max_loan_ltv"
                min="0"
                max="5000"
                step="50"
                value={form.max_loan_ltv}
                unit="$"
                onChange={handleSliderChange}
            />
            */}
            <h4 className="non_slider_2_title">desired loan ltv</h4>
            {/* 
            <PercentSlider id="desired_loan_ltv" id2="desired_loan_rate"
                min="0"
                max="100"
                step="1"
                value={form.desired_loan_ltv}
                value2={form.desired_loan_rate}
                onChange={handleSliderChange}
                slider_status="off"
            />
            */}
            <div className="double_input">
                <div className="resultsval">
                    <div>
                        <p>$</p>
                        <input type="number" id="desired_loan_ltv" name="desired_loan_ltv" value={form.desired_loan_ltv} onChange={handleSliderChange} disabled/>
                    </div>
                </div>
                <div className="dlr_div">
                    <input type="number" id="desired_loan_rate" name="desired_loan_rate" value={form.desired_loan_rate} onChange={handleSliderChange} disabled/>
                    <p>%</p>
                </div>
            </div>
            {/*
            <Slider id="desired_loan_ltv"
                min="0"
                max="2000"
                step="50"
                value={form.desired_loan_ltv}
                unit="$"
                onChange={handleSliderChange}
            />
            */}
            <h4>loan rate</h4>
            <Slider id="loan_rate"
                min="0"
                max="15"
                step="0.1"
                value={form.loan_rate}
                unit="%"
                onChange={handleSliderChange}
            />
            <h4>loan amortization</h4>
            <Slider id="loan_amortization"
                min="0"
                max="60"
                step="1"
                value={form.loan_amortization}
                unit="years"
                onChange={handleSliderChange}
            />
            <h4>mortgage insurance</h4>
            <PercentSlider id="mortgage_insur_limit" id2="mortgage_insur_rate"
                min="0"
                max="15"
                step="1"
                value={form.mortgage_insur_limit}
                value2={form.mortgage_insur_rate}
                unit="%%"
                onChange={handleSliderChange}
            />
            <h4>mortgage points</h4>
            <PercentSlider id="mortgage_points" id2="mortgage_points_rate"
                min="0"
                max="5"
                step="0.1"
                value={form.mortgage_points}
                value2={form.mortgage_points_rate}
                onChange={handleSliderChange}
            />
        </div>
        </>
    )
}

export default LoanAssumptions;