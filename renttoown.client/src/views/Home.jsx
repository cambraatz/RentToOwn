import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
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


const Home = () => {

    //const [slider, setSlider] = useState(500000);
    //const [holding, setHolding] = useState(60);

    const [form,setForm] = useState({
        price: 500000,
        holding_y: 5,
        holding_m: 60,

        rent_m: 3000,
        parking_m: 300,
        rent_insur_m: 600,
        total_rent: 3300,

        //general assumptions...
        cap_gains_rate: 20.0,
        federal_tax_rate: 35.0,
        federal_tax_bool: true,
        salt_limit: 10000,
        salt_limit_bool: true,
        rent_growth: 3.0,
        home_price_appr: 3.0,
        ret_inflation: 3.0,
        other_inflation: 3.0,

        //acquisition...
        inspection: 1000,
        appraisal: 750,
        legal_fees: 1500,
        title_insur_acq: 2500,
        title_insur_acq_rate: 0.5,
        other_lender_costs: 2000,
        transfer_tax_acq: 0,
        transfer_tax_acq_rate: 0,
        total_acquisition: 7750,

        //disposition...
        title_insur_disp: 0,
        transfer_tax_disp: 0,
        transfer_tax_disp_rate: 0,
        broker_fee: 31880,
        broker_rate: 5.5,
        total_disposition: 31880,

        //operating costs...
        property_tax: 3000,
        property_tax_rate: 0.6,
        home_insurance: 3000,
        home_insurance_rate: 0.6,
        maintenance: 5000,
        maintenance_rate: 1,
        hoa_util: 104,
        hoa_util_rate: 0.25,

        //loan assumptions..
        max_loan_ltv: 787750,
        max_loan_rate: 80,
        desired_loan_ltv: 400000,
        desired_loan_rate: 80,
        loan_rate: 7,
        loan_amortization: 30,
        mortgage_insur_rate: 5,
        mortgage_insur_limit: 80,
        mortgage_points: 4000,
        mortgage_points_rate: 1
    });

    const [monthlyCF, setMonthlyCF] = useState({});
    const [annualCF, setAnnualCF] = useState({});

    const navigate = useNavigate();

    //
    // check delivery validity onLoad and after message state change...
    useEffect(() => {
    }, [])

    const handleSliderChange = (e) => {
        let val;
        let rent_adjustment;
        let acquisition;
        let disposition;
        let desired_loan;
        let desired_rate;
        let points;

        switch (e.target.id){
            case "purchaseprice": case "price_input":
                val = parseInt(e.target.value);
                setForm({...form, price: val});
                break
            case "rent": case "rent_input":
                val = parseInt(e.target.value);
                rent_adjustment = val + form.parking_m + form.rent_insur_m;
                setForm({...form, rent_m: val, total_rent: rent_adjustment});
                break
            case "parking": case "parking_input":
                val = parseInt(e.target.value);
                rent_adjustment = form.rent_m + val + form.rent_insur_m;
                setForm({...form, parking_m: val, total_rent: rent_adjustment});
                break
            case "renters": case "renters_input":
                val = parseInt(e.target.value);
                rent_adjustment = form.rent_m + form.parking_m + val;
                setForm({...form, rent_insur_m: val, total_rent: rent_adjustment});
                break
            // general assumptions...
            case "capital_gains": case "capital_gains_input":
                val = parseFloat(e.target.value);
                setForm({...form, cap_gains_rate: val});
                break
            case "federal_tax": case "federal_tax_input":
                val = parseFloat(e.target.value);
                setForm({...form, federal_tax_rate: val});
                break
            case "salt_limit": case "salt_limit_input":
                val = parseInt(e.target.value);
                setForm({...form, salt_limit: val});
                break
            case "rent_growth": case "rent_growth_input":
                val = parseFloat(e.target.value);
                setForm({...form, rent_growth: val});
                break
            case "home_appreciation": case "home_appreciation_input":
                val = parseFloat(e.target.value);
                setForm({...form, home_price_appr: val});
                break
            case "ret_inflation": case "ret_inflation_input":
                val = parseFloat(e.target.value);
                setForm({...form, ret_inflation: val})
                break
            case "other_inflation": case "other_inflation_input":
                val = parseFloat(e.target.value);
                setForm({...form, other_inflation: val});
                break
            // acquisition costs...
            case "inspection": case "inspection_input":
                val = parseInt(e.target.value);
                acquisition = val + form.appraisal + form.legal_fees + form.title_insur_acq + form.other_lender_costs + form.transfer_tax_acq;
                setForm({...form, inspection: val, total_acquisition: acquisition});
                break 
            case "appraisal": case "appraisal_input":
                val = parseInt(e.target.value);
                acquisition = val + form.inspection + form.legal_fees + form.title_insur_acq + form.other_lender_costs + form.transfer_tax_acq;
                setForm({...form, appraisal: val});
                break
            case "legal_fees": case "legal_fees_input":
                val = parseInt(e.target.value);
                acquisition = val + form.appraisal + form.inspection + form.title_insur_acq + form.other_lender_costs + form.transfer_tax_acq;
                setForm({...form, legal_fees: val});
                break
            case "title_insur_acq_rate": case "title_insur_acq_rate_input":
                val = parseFloat(e.target.value);
                acquisition = parseInt((val/100)*form.price) + form.appraisal + form.legal_fees + form.inspection + form.other_lender_costs + form.transfer_tax_acq;
                setForm({...form, title_insur_acq_rate: val, title_insur_acq: parseInt((val/100)*form.price), total_acquisition: acquisition});
                break
            case "other_lender_costs": case "other_lender_costs_input":
                val = parseInt(e.target.value);
                acquisition = val + form.appraisal + form.legal_fees + form.title_insur_acq + form.inspection + form.transfer_tax_acq;
                setForm({...form, other_lender_costs: val, total_acquisition: acquisition});
                break
            case "transfer_tax_acq_rate": case "transfer_tax_acq_rate_input":
                val = parseFloat(e.target.value);
                acquisition = parseInt((val/100)*form.price) + form.appraisal + form.legal_fees + form.title_insur_acq + form.other_lender_costs + form.inspection;
                setForm({...form, transfer_tax_acq_rate: val, transfer_tax_acq: parseInt((val/100)*form.price), total_acquisition: acquisition});
                break
            // disposition costs...
            case "title_insur_disp": case "title_insur_disp_input":
                val = parseInt(e.target.value);
                disposition = val + form.transfer_tax_disp + form.broker_fee;
                setForm({...form, title_insur_disp: val, total_disposition: disposition});
                break
            case "transfer_tax_disp_rate": case "transfer_tax_disp_rate_input":
                val = parseFloat(e.target.value);
                disposition = parseInt((val/100)*form.price) + form.title_insur_disp + form.broker_fee;
                setForm({...form, transfer_tax_disp_rate: val, transfer_tax_disp: parseInt((val/100)*form.price), total_disposition: disposition});
                break
            case "broker_rate": case "broker_rate_input":
                val = parseFloat(e.target.value);
                disposition = parseInt((val/100)*form.price) + form.title_insur_disp + form.transfer_tax_disp;
                setForm({...form, broker_rate: val, broker_fee: parseInt((val/100)*form.price), total_disposition: disposition});
                break
            // operation costs...
            case "property_tax_rate": case "property_tax_rate_input":
                val = parseFloat(e.target.value);
                setForm({...form, property_tax_rate: val, property_tax: parseInt((val/100)*form.price)});
                break
            case "home_insurance_rate": case "home_insurance_rate_input":
                val = parseFloat(e.target.value);
                setForm({...form, home_insurance_rate: val, home_insurance: parseInt((val/100)*form.price)});
                break
            case "maintenance_rate": case "maintenance_rate_input":
                val = parseFloat(e.target.value);
                setForm({...form, maintenance_rate: val, maintenance: parseInt((val/100)*form.price)});
                break
            case "hoa_util_rate": case "hoa_util_rate_input":
                val = parseFloat(e.target.value);
                setForm({...form, hoa_util_rate: val, hoa_util: parseInt((val/100)*form.price)});
                break
            // loan assumptions...
            case "max_loan_rate": case "max_loan_rate_input":
                val = parseFloat(e.target.value);
                desired_loan = Math.min((form.price*val), form.max_loan_ltv);
                desired_rate = desired_loan/form.price;
                points = (form.mortgage_points_rate/100) * desired_loan;
                setForm({...form, max_loan_rate: val, desired_loan_ltv: desired_loan, desired_loan_rate: desired_rate, mortgage_points: points});
                break
            case "max_loan_ltv": case "max_loan_ltv_input":
                val = parseInt(e.target.value);
                desired_loan = Math.min(form.price*(form.max_loan_rate/100), val);
                desired_rate = desired_loan/form.price;
                points = (form.mortgage_points_rate/100) * desired_loan;
                setForm({...form, max_loan_ltv: val, desired_loan_ltv: desired_loan, desired_loan_rate: desired_rate, mortgage_points: points});
                break
            case "loan_rate": case "loan_rate_input":
                val = parseFloat(e.target.value);
                setForm({...form, loan_rate: val});
                break
            case "loan_amortization": case "loan_amortization_input":
                val = parseInt(e.target.value);
                setForm({...form, loan_amortization: val});
                break
            case "mortgage_insur_rate": case "mortgage_insur_rate_input":
                val = parseFloat(e.target.value);
                setForm({...form, mortgage_insur_rate: Math.min(val,form.mortgage_insur_limit)});
                break
            case "mortgage_insur_limit": case "mortgage_insur_limit_input":
                val = parseFloat(e.target.value);
                setForm({...form, mortgage_insur_limit: val});
                break
            case "mortgage_points_rate": case "mortgage_points_rate_input":
                val = parseFloat(e.target.value);
                setForm({...form, mortgage_points_rate: val, mortgage_points: parseInt((val/100)*form.desired_loan_ltv)});
                break
            case "mortgage_points": case "mortgage_points_input":
                val = parseInt(e.target.value);
                setForm({...form, mortgage_points: val, mortgage_points_rate: (val/desired_loan)*100});
                break
            default:
                break
        }
    };

    const handleHPChange = (e) => {
        setForm({...form, holding_y: e.target.value, holding_m: e.target.value * 12});
    }

    //const [tfToggle, setTFToggle] = useState("closed")

    const expandClick = (e) => {
        const parent = e.target.parentNode;
        const child = parent.children[1];
        console.log(parent.children[0]);

        if (child.style.maxHeight) {
            child.style.maxHeight = null;
            parent.children[1].style.padding = "0 5%";
            parent.children[0].style.borderRadius = "10px";
        }
        else {
            child.style.maxHeight = child.scrollHeight + "px";
            parent.children[1].style.padding = "0 5% 5%";
            parent.children[0].style.borderRadius = "10px 10px 0 0";
        }
    }

    async function handleClick(e) {
        e.preventDefault()
        //navigate("/response");
        const query = {
            ...form,
            user_id: "testUser" + Math.floor(Math.random() * 10000)
        };

        //console.log("form: ", form);

        let queryData = new FormData();
        for (const [key,value] of Object.entries(form)){
            queryData.append(key,value)
        }

        queryData.append("UserId","testUser");

        console.log("query: ", query);

        const API_URL = "https://localhost:7079/";
        try {
            const response = await fetch(API_URL + "Query/PostQuery", {
                //body: queryData,
                body: JSON.stringify(query),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error!  status: ${response.status}`)
            }

            const data = await response.json();
            setMonthlyCF(data.mcf);
            setAnnualCF(data.acf);

            console.log(data.mcf);
            console.log(data.acf);

        } catch (error) {
            console.error("Error posting query:", error);
        }
    }

    const sum = (arr) => {
        return arr.reduce(function (a,b) {
            return a + b;
        }, 0);
    }

    const generateACFTable = () => {
        if (annualCF.years) {
            const table = document.getElementById('top_table');
            table.scrollTo({
                behavior: 'smooth',
                block: 'center'
            });

            return(
                <>
                <h3 className="table_caption">annual cash flow</h3>
                <div className="table_div">
                    <table id="acf_table">
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Total</th>
                                {annualCF.years.map((year, index) => (
                                    <th key={"acf_year"+index}>{year}</th>
                                ))}
                            </tr>
                            <tr>
                                <th>Month</th>
                                <th></th>
                                {annualCF.months.map((month, index) => (
                                    <th key={"acf_month"+{month}+index}>{month}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Renter</th>
                                <td>{Math.round(sum(annualCF.rent_cf))}</td>
                                {annualCF.rent_cf.map((rent, index) => (
                                    <td key={"acf_rentcf"+index}>{Math.round(rent)}</td>
                                ))}
                            </tr>
                            <tr>
                                <th>Unlevered Owner</th>
                                <td>{Math.round(sum(annualCF.unlevered_cf))}</td>
                                {annualCF.unlevered_cf.map((cf, index) => (
                                    <td key={"acf_unleveredcf"+index}>{Math.round(cf)}</td>
                                ))}
                            </tr>
                            <tr>
                                <th>Unlevered Owner Net</th>
                                <td>{Math.round(sum(annualCF.unlevered_net_cf))}</td>
                                {annualCF.unlevered_net_cf.map((cf, index) => (
                                    <td key={"acf_unleverednetcf"+index}>{Math.round(cf)}</td>
                                ))}
                            </tr>
                            <tr>
                                <th>Levered Owner</th>
                                <td>{Math.round(sum(annualCF.levered_cf))}</td>
                                {annualCF.levered_cf.map((cf, index) => (
                                    <td key={"acf_leveredcf"+index}>{Math.round(cf)}</td>
                                ))}
                            </tr>
                            <tr>
                                <th>Levered Owner Net</th>
                                <td>{Math.round(sum(annualCF.levered_net_cf))}</td>
                                {annualCF.levered_net_cf.map((cf, index) => (
                                    <td key={"acf_leverednetcf"+index}>{Math.round(cf)}</td>
                                ))}
                            </tr>
                            <tr>
                                <th>Cum. Gross Equity</th>
                                <td></td>
                                {annualCF.cum_equity.map((cf, index) => (
                                    <td key={"acf_cumequity"+index}>{Math.round(cf)}</td>
                                ))}
                            </tr>
                            <tr>
                                <th>Cum. Net Equity</th>
                                <td></td>
                                {annualCF.cum_net_equity.map((cf, index) => (
                                    <td key={"acf_cumnetequity"+index}>{Math.round(cf)}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
                </>
        )};
    };

    const generateMCFTable = () => {
        if (monthlyCF.years) {
            return(
                <>
                <h3 className="table_caption" id="bottom_table">monthly cash flow</h3>
                <div className="table_div">
                    <table id="mcf_table">
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Total</th>
                                {annualCF.years.map((year, index) => (
                                    <th key={"mcf_year"+index} colSpan="12">{year+1}</th>
                                ))}
                            </tr>
                            <tr>
                                <th>Month</th>
                                <th></th>
                                {monthlyCF.months.map((month, index) => (
                                    <th key={"mcf_month"+{month}+index}>{month}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Renter</th>
                                <td>{Math.round(sum(monthlyCF.rent_cf))}</td>
                                {monthlyCF.rent_cf.map((rent, index) => (
                                    <td key={"mcf_rentcf"+index}>{Math.round(rent)}</td>
                                ))}
                            </tr>
                            <tr>
                                <th>Unlevered Owner</th>
                                <td>{Math.round(sum(monthlyCF.unlevered_cf))}</td>
                                {monthlyCF.unlevered_cf.map((cf, index) => (
                                    <td key={"mcf_unleveredcf"+index}>{Math.round(cf)}</td>
                                ))}
                            </tr>
                            <tr>
                                <th>Unlevered Owner Net</th>
                                <td>{Math.round(sum(monthlyCF.unlevered_net_cf))}</td>
                                {monthlyCF.unlevered_net_cf.map((cf, index) => (
                                    <td key={"mcf_unleverednetcf"+index}>{Math.round(cf)}</td>
                                ))}
                            </tr>
                            <tr>
                                <th>Levered Owner</th>
                                <td>{Math.round(sum(monthlyCF.levered_cf))}</td>
                                {monthlyCF.levered_cf.map((cf, index) => (
                                    <td key={"mcf_leveredcf"+index}>{Math.round(cf)}</td>
                                ))}
                            </tr>
                            <tr>
                                <th>Levered Owner Net</th>
                                <td>{Math.round(sum(monthlyCF.levered_net_cf))}</td>
                                {monthlyCF.levered_net_cf.map((cf, index) => (
                                    <td key={"mcf_leverednetcf"+index}>{Math.round(cf)}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
                </>
        )};
    };

    //
    // render template...
    return(
        <>
        <Header />
        <form className="inputfield">
            <h3>purchase assumptions</h3>
            <div className="pilldiv">
                <div id="input1">
                    <h4>purchase price</h4>
                    <Slider id="purchaseprice"
                        min="10000"
                        max="10000000"
                        step="1000"
                        value={form.price}
                        unit="$"
                        onChange={handleSliderChange}
                    />
                </div>
                <div id="input2">
                    <h4>holding period</h4>
                    <div className="incrementerdiv">
                        <div>
                            <input className="box" type="number" name="quantity" value={form.holding_y} min="0" max="60" step="1" onChange={handleHPChange}/>
                            <span>years</span>
                        </div>
                        <div>
                            <input className="box" type="number" name="quantity" value={form.holding_m} min="0" max="720" disabled />
                            <span>months</span>
                        </div>
                    </div>
                </div>
            </div>
            <h3>rent assumptions</h3>
            <div className="pilldiv">
                <div id="input3">
                    <h4>monthly rent</h4>
                    <Slider id="rent"
                        min="100"
                        max="10000"
                        step="100"
                        value={form.rent_m}
                        unit="$"
                        onChange={handleSliderChange}
                    />
                </div>
                <div id="input4">
                    <h4>parking costs</h4>
                    <Slider id="parking"
                        min="0"
                        max="2000"
                        step="10"
                        value={form.parking_m}
                        unit="$"
                        onChange={handleSliderChange}
                    />
                </div>
                <div id="input5">
                    <h4>renter&apos;s insurance</h4>
                    <Slider id="renters"
                        min="0"
                        max="1000"
                        step="10"
                        value={form.rent_insur_m}
                        unit="$"
                        onChange={handleSliderChange}
                    />
                </div>
                <div id="input6">
                    <h4>total rent</h4>
                    <div className="incrementerdiv">
                        <div>
                            <p>$</p>
                            <input type="number" name="quantity" value={form.total_rent} onChange={handleHPChange} disabled/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border">
                <button className="button" onClick={handleClick}><span>generate table</span></button>
            </div>
            <h3>advanced analysis</h3>
            <div id="ga_tab" className="collapsible">
                <GeneralAssumptions data={form} onChange={handleSliderChange} onClick={expandClick}/>
            </div>
            <div id="ac_tab" className="collapsible">
                <AcquisitionCosts data={form} onChange={handleSliderChange} onClick={expandClick}/>
            </div>
            <div id="dc_tab" className="collapsible">
                <DispositionCosts data={form} onChange={handleSliderChange} onClick={expandClick}/>
            </div>
            <div id="oc_tab" className="collapsible">
                <OperatingCosts data={form} onChange={handleSliderChange} onClick={expandClick}/>
            </div>
            <div id="la_tab" className="collapsible">
                <LoanAssumptions data={form} onChange={handleSliderChange} onClick={expandClick}/>
            </div>
            <div className="tail">
                <button className="button" onClick={handleClick}><span>generate table</span></button>
            </div>
        </form>

        <span id="top_table"></span>
        {generateACFTable()}
        {generateMCFTable()}
        </>
    )
};

export default Home;