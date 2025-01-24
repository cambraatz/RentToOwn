import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../App.css';

// props: min, max, step, value, id, onChange...
const PercentSlider = (props) => {
    const man_id = props.id + "_input";
    const man_id2 = props.id2 ? props.id2 + "_input" : null;

    let value_box;
    if (props.unit === "%%") {
        value_box = (
            <div className="double_input">
                <div>
                    <p className="minor_header">pmi threshold</p>
                    <div className="resultsval">
                        <div id="results_cutoff">
                            <input className="box" type="number" id={man_id} name={man_id} value={props.value} min="0" max="100" onChange={props.onChange}/>
                            <p>%</p>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="minor_header">rate</p>
                    <div className="sliderval">
                        <input className="box" type="number" id={man_id2} name={man_id2} value={props.value2} min={props.min} max={props.max} step={props.step} onChange={props.onChange}/>
                        <p>%</p>
                    </div>
                </div>
            </div>
        )
    }
    else {
        value_box = (
            <div className="double_input">
                <div className="resultsval">
                    <div>
                        <p>$</p>
                        <input className="box" type="number" id={man_id} name={man_id} value={props.value} onChange={props.onChange} disabled/>
                    </div>
                </div>
                <div className="sliderval">
                    <input className="box" type="number" id={man_id2} name={man_id2} value={props.value2} min={props.min} max={props.max} step={props.step} onChange={props.onChange}/>
                    <p>%</p>
                </div>
            </div>
        )
    }
    
    return (
        <>
        <div className="slidercontainer">
            <div className="sliderdiv">
                <input type="range" 
                        min={props.min}
                        max={props.max}
                        step={props.step}
                        value={props.value2} 
                        className="slider" 
                        id={man_id2}
                        onChange={props.onChange}
                />
            </div>
        </div>
        {value_box}
        </>
    )
}

export default PercentSlider;