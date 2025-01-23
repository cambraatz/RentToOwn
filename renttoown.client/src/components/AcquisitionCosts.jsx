import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
//import Header from '../components/Header';
import '../App.css';
import Slider from './Slider';
import PercentSlider from './PercentSlider';
import house_icon from "../assets/house-icon.png";

/*
inspection: 1000,
appraisal: 750,
legal_fees: 1500,
title_insur_acq: 2500,
title_insur_acq_rate: 0.5,
other_lender_costs: 2000,
transfer_tax_acq: 0,
transfer_tax_acq_rate: 0,
total_acquisition: 7750,
*/

const AcquisitionCosts = (props) => {
    const handleSliderChange = props.onChange;
    const expandClick = props.onClick;
    const form = props.data;
    return(
        <>
        <div className="advanced" id="taxes_fees" onClick={expandClick}>
            <img 
                src={house_icon}
                alt=""
                id="bank_icon"
                className="menu_icons"
            />
            <h4>acquisition costs</h4>
        </div>
        <div className="bank_icon_content collapsible_content">
            <h4>inspection</h4>
            <Slider id="inspection"
                min="0"
                max="5000"
                step="50"
                value={form.inspection}
                unit="$"
                onChange={handleSliderChange}
            />
            <h4>appraisal</h4>
            <Slider id="appraisal"
                min="0"
                max="2000"
                step="50"
                value={form.appraisal}
                unit="$"
                onChange={handleSliderChange}
            />
            <h4>legal fees</h4>
            <Slider id="legal_fees"
                min="0"
                max="5000"
                step="100"
                value={form.legal_fees}
                unit="$"
                onChange={handleSliderChange}
            />
            <h4>title insurance</h4>
            <PercentSlider id="title_insur_acq" id2="title_insur_acq_rate"
                min="0"
                max="5"
                step="0.1"
                value={form.title_insur_acq}
                value2={form.title_insur_acq_rate}
                onChange={handleSliderChange}
            />
            <h4>other lender costs</h4>
            <Slider id="other_lender_costs"
                min="0"
                max="5000"
                step="100"
                value={form.other_lender_costs}
                unit="$"
                onChange={handleSliderChange}
            />
            <h4>transfer taxes</h4>
            <div className="slidercontainer">
                <div className="sliderdiv">
                    <input type="range" 
                            min="0"
                            max="5"
                            step="0.1"
                            value={form.transfer_tax_acq_rate} 
                            className="slider" 
                            id="transfer_tax_acq_rate"
                            onChange={handleSliderChange}
                    />
                </div>
            </div>
            <div className="double_input">
                <div className="resultsval">
                    <div>
                        <p>$</p>
                        <input type="number" id="transfer_tax_acq" name="transfer_tax_acq" value={form.transfer_tax_acq} onChange={handleSliderChange} disabled/>
                    </div>
                </div>
                <div className="sliderval">
                    <input type="number" id="transfer_tax_acq_rate" name="transfer_tax_acq_rate" value={form.transfer_tax_acq_rate} min="0" max="5" step="0.1" onChange={handleSliderChange}/>
                    <p>%</p>
                </div>
            </div>
            {/*
            <Slider id="transfer_tax_acq"
                min="0"
                max="5000"
                step="100"
                value={form.transfer_tax_acq}
                unit="%"
                onChange={handleSliderChange}
            />
            */}
            <div id="input6">
                <h4>total acquisition</h4>
                <div className="incrementerdiv">
                    <div>
                        <p>$</p>
                        <input type="number" name="quantity" value={form.total_acquisition} onChange={handleSliderChange} disabled/>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default AcquisitionCosts;