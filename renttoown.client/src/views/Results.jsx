import { useState, useEffect } from 'react';
//import { useNavigate } from "react-router-dom";
import Header from '../components/Header';
import '../App.css';
import Slider from '../components/Slider';
//import bank_icon from "../assets/bank_icon.svg";
import GeneralAssumptions from "../components/GeneralAssumptions";
import AcquisitionCosts from '../components/AcquisitionCosts';
import DispositionCosts from '../components/DispositionCosts';
import OperatingCosts from '../components/OperatingCosts';
import LoanAssumptions from '../components/LoanAssumptions';
//import '../styles/header_styling.css';
//import Popup from './Popup';
//import { scrapeDate, renderDate, getDate, API_URL } from '../Scripts/helperFunctions';


const Results = () => {

    //const [slider, setSlider] = useState(500000);
    //const [holding, setHolding] = useState(60);

    const [form,setForm] = useState(null);

    //const navigate = useNavigate;

    //
    // check delivery validity onLoad and after message state change...
    useEffect(() => {
    }, [])

    const handleSliderChange = (e) => {
        console.log("yet to implement handle slider change");
    };

    const handleHPChange = (e) => {
        console.log("yet to implement handle hp change");
    }

    const expandClick = (e) => {
        console.log("yet to implement expand click");
    }

    const handleClick = (e) => {
        e.preventDefault()
        console.log("yet to implement handle click");
    }

    const [status,setStatus] = useState("monthly");

    const [monthly,setMonthly] = useState({
        interest: 2322,
        property_tax: 250,
        insurance: 250,
        maintenance: 417,
        hoa_util: 104,
        mortgage_insur: 0,
        subtotal: 3343,
        amort: 364,
        total: 3707,
        min_total: 3186,
        rent: 3000,
        rent_parking: 300,
        rent_insur: 50,
        rent_total: 3350
    });

    const [annual,setAnnual] = useState({
        interest: 27861,
        property_tax: 3000,
        insurance: 3000,
        maintenance: 5000,
        hoa_util: 1250,
        mortgage_insur: 0,
        subtotal: 40111,
        amort: 4373,
        total: 44485,
        min_total: 38235,
        rent: 36000,
        rent_parking: 3600,
        rent_insur: 600,
        rent_total: 40200
    });

    const [netOfRent,setNetOfRent] = useState({
        init_equity: 111750,
        max_equity: 111750,
        profit: 101631,
        unlevered_irr: 7.6,
        levered_irr: 15.5,
        levered_em: 1.91
    });

    const [gross,setGross] = useState({
        init_equity: 111750,
        max_equity: 281846,
        profit: -111796,
        unlevered_irr: -0.7,
        levered_irr: -14.4,
        levered_em: 0.6
    });

    const [summary,setSummary] = useState({
        interest: 2322,
        property_tax: 250,
        insurance: 250,
        maintenance: 417,
        hoa_util: 104,
        mortgage_insur: 0,
        subtotal: 3343,
        amort: 364,
        total: 3707,
        min_total: 3186,
        rent: 3000,
        rent_parking: 300,
        rent_insur: 50,
        rent_total: 3350,
        init_equity: 111750,
        max_equity: 111750,
        profit: 101631,
        unlevered_irr: 7.6,
        levered_irr: 15.5,
        levered_em: 1.91,
        te_levered_irr: 19.4,
        te_levered_em: 2.39
    })

    const handleToggle = (e) => {
        if (e.target.id === "net_of_rent" || e.target.id === "gross"){
            if (e.target.id === "net_of_rent"){
                setSummary({...summary,
                            init_equity: netOfRent.init_equity,
                            max_equity: netOfRent.max_equity,
                            profit: netOfRent.profit,
                            unlevered_irr: netOfRent.unlevered_irr,
                            levered_irr: netOfRent.levered_irr,
                            levered_em: netOfRent.levered_em
                });
                document.getElementById("net_of_rent").style.backgroundColor = "#81dfbc";
                document.getElementById("gross").style.backgroundColor = "#eee";
            }
            if (e.target.id === "gross"){
                setSummary({...summary,
                    init_equity: gross.init_equity,
                    max_equity: gross.max_equity,
                    profit: gross.profit,
                    unlevered_irr: gross.unlevered_irr,
                    levered_irr: gross.levered_irr,
                    levered_em: gross.levered_em
                });
                document.getElementById("net_of_rent").style.backgroundColor = "#eee";
                document.getElementById("gross").style.backgroundColor = "#81dfbc";
            }
        }
        else {
            const lefts = document.getElementsByClassName("toggle_m");
            const rights = document.getElementsByClassName("toggle_y");

            if (e.target.className === "toggle_m"){
                setSummary(monthly);
                for (let i=0; i<lefts.length; i++) {
                    lefts[i].style.backgroundColor = "#81dfbc";
                    rights[i].style.backgroundColor = "#eee";
                }
            }
            if (e.target.className === "toggle_y"){
                setSummary(annual);
                for (let i=0; i<rights.length; i++) {
                    lefts[i].style.backgroundColor = "#eee";
                    rights[i].style.backgroundColor = "#81dfbc";
                }
            }
        }
    }

    const toggleButton = (
        <div className="toggle">
            <div id="monthly" className="toggle_m" onClick={handleToggle}>
                <p>monthly</p>
            </div>
            <div id="annual" className="toggle_y" onClick={handleToggle}>
                <p>annual</p>
            </div>
        </div>
    );

    const returnsButton = (
        <div className="toggle">
            <div id="net_of_rent" className="returns_nor" onClick={handleToggle}>
                <p>net of rent</p>
            </div>
            <div id="gross" className="returns_gross" onClick={handleToggle}>
                <p>gross</p>
            </div>
        </div>
    );

    //
    // render template...
    return(
        <>
        <Header />
        <div className="resultsfield">
            <div className="toggle_header">
                <h3>owner payments summary</h3>
                {toggleButton}
            </div>
            <div className="pilldiv">
                <div className="result_row">
                    <h4>interest</h4>
                    <p>${summary.interest}</p>
                </div>
                <div className="result_row">
                    <h4>property tax</h4>
                    <p>${summary.property_tax}</p>
                </div>
                <div className="result_row">
                    <h4>insurance</h4>
                    <p>${summary.insurance}</p>
                </div>
                <div className="result_row">
                    <h4>maintenance</h4>
                    <p>${summary.maintenance}</p>
                </div>
                <div className="result_row">
                    <h4>hoa/utilities</h4>
                    <p>${summary.hoa_util}</p>
                </div>
                <div className="result_row">
                    <h4>mortgage insurance</h4>
                    <p>${summary.mortgage_insur}</p>
                </div>
                <div className="result_row subtotal">
                    <h2>subtotal</h2>
                    <h4>${summary.subtotal}</h4>
                </div>
                <div className="result_row">
                    <h4>amortization</h4>
                    <p>${summary.amort}</p>
                </div>
                <div className="result_row total">
                    <h2>total</h2>
                    <h4>${summary.total}</h4>
                </div>
                <div className="result_row">
                    <h5>minimum</h5>
                    <p>${summary.min_total}</p>
                </div>
            </div>
        </div>
        <div className="resultsfield">
            <div className="toggle_header">
                <h3>renter payments summary</h3>
                {toggleButton}
            </div>
            <div className="pilldiv">
                <div className="result_row">
                    <h4>rent</h4>
                    <p>${summary.rent}</p>
                </div>
                <div className="result_row">
                    <h4>parking</h4>
                    <p>${summary.rent_parking}</p>
                </div>
                <div className="result_row">
                    <h4>renter&apos;s insurance</h4>
                    <p>${summary.rent_insur}</p>
                </div>
                <div className="result_row total">
                    <h2>total</h2>
                    <h4>${summary.rent_total}</h4>
                </div>
            </div>
            <div className="resultsfield">
                <div className="toggle_header">
                    <h3>returns summary</h3>
                    {returnsButton}
                </div>
                <div className="pilldiv">
                    <div className="result_row">
                        <h4>initial_equity</h4>
                        <p>${summary.init_equity}</p>
                    </div>
                    <div className="result_row">
                        <h4>max equity</h4>
                        <p>${summary.max_equity}</p>
                    </div>
                    <div className="result_row">
                        <h4>profit</h4>
                        <p>${summary.profit}</p>
                    </div>
                    <div className="result_row total">
                        <h4>unlevered irr</h4>
                        <p>{summary.unlevered_irr}%</p>
                    </div>
                    <div className="result_row">
                        <h4>levered irr</h4>
                        <p>{summary.levered_irr}%</p>
                    </div>
                    <div className="result_row">
                        <h4>levered em</h4>
                        <p>{summary.levered_em}%</p>
                    </div>
                </div>
            </div>
            <div className="border">
                <button className="button" onClick={handleClick}><span>back to top</span></button>
            </div>
        </div>
        </>
    )
};

export default Results;