import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../App.css';

// props: min, max, step, value, id, onChange...
const Slider = (props) => {
    const man_id = props.id + "_input";
    const man_id2 = props.id2 ? props.id2 + "_input" : null;

    let value_box = null;
    if (props.unit === "%") {
        value_box = (
            <div className="sliderval">
                <div>
                    <input type="number" id={man_id} name={man_id} value={props.value} min={props.min} max={props.max} step={props.step} onChange={props.onChange}/>
                    <p>%</p>
                </div>
            </div>
        )
    }

    if (props.unit === "$") {
        value_box = (
            <div className="sliderval">
                <div>
                    <p>$</p>
                    <input type="number" id={man_id} name={man_id} value={props.value} min={props.min} max={props.max} step={props.step} onChange={props.onChange}/>
                </div>
            </div>
        )
    }

    if (props.unit === "$%") {
        value_box = (
            <div className="double_input">
                <div className="resultsval">
                    <div>
                        <p>$</p>
                        <input type="number" id={man_id} name={man_id} value={props.value} onChange={props.onChange} disabled/>
                    </div>
                </div>
                <div className="sliderval">
                    <input type="number" id={man_id2} name={man_id2} value={props.value2} min={props.min} max={props.max} step={props.step} onChange={props.onChange}/>
                    <p>%</p>
                </div>
            </div>
        )
    }

    if (props.unit === "%%") {
        value_box = (
            <div className="double_input">
                <div className="resultsval">
                    {/*<div>
                        <input type="number" id={man_id} name={man_id} value={props.value} onChange={props.onChange} disabled/>
                        <p>%</p>
                    </div>*/}
                </div>
                <div className="sliderval">
                    <input type="number" id={man_id2} name={man_id2} value={props.value2} min={props.min} max={props.max} step={props.step} onChange={props.onChange}/>
                    <p>%</p>
                </div>
            </div>
        )
    }

    if (props.unit === "years") {
        value_box = (
            <div className="sliderval">
                <div id="amort_div">
                    <input type="number" id={man_id} name={man_id} value={props.value} min={props.min} max={props.max} step={props.step} onChange={props.onChange}/>
                    <p>years</p>
                </div>
            </div>
        )
    }

    if (props.unit === "points") {
        value_box = (
            <div className="sliderval">
                <div id="amort_div">
                    <input type="number" id={man_id} name={man_id} value={props.value} min={props.min} max={props.max} step={props.step} onChange={props.onChange}/>
                    <p>years</p>
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
                        value={props.value} 
                        className="slider" 
                        id={props.id}
                        onChange={props.onChange}
                />
            </div>
        </div>
        {value_box}
        </>
    )
}

export default Slider;