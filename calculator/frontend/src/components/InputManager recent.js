import React, { useState, useEffect, Component } from "react";
import '../../static/css/App.css';
import PurchaseAssumptions from "./PurchaseAssumptions";
import RentAssumptions from "./RentAssumptions";
import GeneralAssumptions from "./GeneralAssumptions";
import AcquisitionCosts from "./AcquisitionCosts";
import DispositionCosts from "./DispositionCosts";
import OperatingCosts from "./OperatingCosts";
import LoanAssumptions from "./LoanAssumptions";
//import ACFTable from "./ACFTable";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalculateIcon from '@mui/icons-material/Calculate';
//import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
//import Table from "../components/Table";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from "axios";
import { Cookies } from "react-cookie";
import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';

import { useRouter, useNavigate } from "react-router-dom"
//import Button from "@material-ui/core/Button";
import Grid from '@mui/material/Unstable_Grid2';
import { TextField } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import MCFTable from "./MCFTable";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

//import Typography from "@material-ui/core/Typography";
//import TextField from "@material-ui/core/TextField";
//import FormHelperText from "@material-ui/core/FormHelperText";
//import FormControl from '@material-ui/core/FormControl';
//import { Link } from "react-router-dom";
//import Radio from "@material-ui/core/Radio";
//import RadioGroup from "@material-ui/core/RadioGroup";
//import FormControlLabel from "@material-ui/core/FormControlLabel";

const InputManager = (props) => {  
    
    /* State Manager for JSON Form Data */
    const Navigate = useNavigate()
    const [formData, setFormData] = useState({
        user_id: props.user_id,
        purchase_price: 500000,
        hold_period: 5,
        hold_period_m: 60,

        apartment_rent: 3000,
        parking_rent: 300,
        renters_insurance: 600,
        monthly_rent: 3300,

        rate_capital_gains: 20,
        rate_federal_tax: 35,
        bool_federal: true,
        salt_limit: 10000,
        bool_salt: true,
        rent_growth: 3,
        home_appreciation: 3,
        ret_inflation: 3,
        other_inflation: 3,

        fee_inspection: 1000,
        fee_appraisal: 750,
        fee_legal: 1500,
        rate_title_insurance_aq: 0.5,
        title_insurance_aq: 2500,
        lender_costs_other: 2000,
        rate_transfer_tax_aq: 0,
        transfer_tax_aq: 0,
        total_acquisition: 7750,

        rate_title_insurance_dis: 0,
        title_insurance_dis: 0,
        rate_transfer_tax_dis: 0,
        transfer_tax_dis: 0,
        rate_brokerage: 5.5,
        fee_brokerage: 31880,
        total_disposition: 31880,

        rate_property_tax: 0.6,
        property_tax: 3000,
        rate_home_insurance: 0.6,
        home_insurance: 3000,
        rate_home_maintenance: 1,
        home_maintenance: 5000,
        rate_hoa_util: 0.25,
        hoa_util: 104,

        rate_ltv_max: 80,
        loan_ltv_max: 787750,
        loan_ltv_desired: 400000,
        rate_ltv_desired: 80,
        rate_home_loan: 7,
        amort_home_loan: 30,
        rate_mortgage_insurance: 5,
        clear_mortgage_insurance: 80,
        rate_mortgage_points: 1,
        mortgage_points: 4000,
    });

    const handleSubmit = (e) => {
        //alert(document.cookie)
        //alert(getCookie("user"))
        e.preventDefault();
        //const valid = fetch(`/api/datafields/${formData.user_id}`)
        if (e.user_id) {
        //if (valid) {
            const requestOptions = {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            };
            fetch(`/api/datafields/${e.user_id}`, requestOptions)
                .then((response) => response.json())
                //.then((data) => Navigate(`/datafield/${data.user_id}`));
                .then((data) => {
                    //updateTable(data)
                    setFormData({'user_id': data.user_id, ...formData})
                    setMCFTable(data.MCF)
                    setACFTable(data.ACF)
                    setMCFInterest(data.total_interest)
                    setMCFMortInsPay(data.mortgage_insurance_payment)
                    setAmortization(data.amortization)

                    setInitEquityNOR(data.initial_equity_NOR)
                    setInitEquityGROSS(data.initial_equity_GROSS)
                    setMaxEquityNOR(data.max_equity_NOR)
                    setMaxEquityGROSS(data.max_equity_GROSS)
                    setProfitNOR(data.profit_NOR)
                    setProfitGROSS(data.profit_GROSS)
                    setUNLVIRRNOR(data.unlv_irr_NOR)
                    setUNLVIRRGROSS(data.unlv_irr_GROSS)
                    setLVIRRNOR(data.lv_irr_NOR)
                    setLVIRRGROSS(data.lv_irr_GROSS)
                    setLVEMNOR(data.lv_em_NOR)
                    setLVEMGROSS(data.lv_em_GROSS)
                });
        } else {
            const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            };
            fetch("/api/createdatafield", requestOptions)
                .then((response) => response.json())
                //.then((data) => Navigate(`/datafield/${data.user_id}`));
                .then((data) => {
                    //updateTable(data)
                    setFormData({'user_id': data.user_id, ...formData})
                    setMCFTable(data.MCF)
                    setACFTable(data.ACF)
                    setMCFInterest(data.total_interest)
                    setMCFMortInsPay(data.mortgage_insurance_payment)
                    setAmortization(data.amortization)

                    setInitEquityNOR(data.initial_equity_NOR)
                    setInitEquityGROSS(data.initial_equity_GROSS)
                    setMaxEquityNOR(data.max_equity_NOR)
                    setMaxEquityGROSS(data.max_equity_GROSS)
                    setProfitNOR(data.profit_NOR)
                    setProfitGROSS(data.profit_GROSS)
                    setUNLVIRRNOR(data.unlv_irr_NOR)
                    setUNLVIRRGROSS(data.unlv_irr_GROSS)
                    setLVIRRNOR(data.lv_irr_NOR)
                    setLVIRRGROSS(data.lv_irr_GROSS)
                    setLVEMNOR(data.lv_em_NOR)
                    setLVEMGROSS(data.lv_em_GROSS)
                });
        }
    }

    /*
    const getData = (e) => {
        const requestOptions = {
            method: "GET",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData),
        };
        fetch("/api/getdata" + "?user_id=" + formData.user_id)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('Something went wrong');
            })
            .then((data) => {
                setMCFTable(data.mcf_table)
                setMCFUTable(data.mcfu_table)
                setMCFLTable(data.mcfl_table)
                setMCFRTable(data.mcfr_table)
            })
            .catch((error) => {
                console.log(error)
                handleSubmit
            });*/

        /*
        fetch("/api/getdata" + "?user_id=" + props.user_id)
            .then((response) => response.json())
            .then((data) => {
                setMCFTable(data.mcf_table)
                setMCFUTable(data.mcfu_table)
                setMCFLTable(data.mcfl_table)
                setMCFRTable(data.mcfr_table)
            });
            
    }*/

    /* State Manager for Purchase Assumptions */ 
    const [purchasePrice, setPurchasePrice] = useState(500000);
    const [holdingPeriod, setHoldingPeriod] = useState(5);
    const [holdingPeriodM, setHoldingPeriodM] = useState(60);

    const handlePAInput = (e) => {
        const val = Number(e.target.value);
        let calc = val * (titleInsuranceRateAq / 100);
        let calc1 = val * (transferTaxRate / 100);
        let calc2 = Math.min(val * (maxLtvLoanRate/100), maxLtvLoan);
        let calc3 = Math.min(maxLtvLoanRate, (maxLtvLoan/val)*100);
        let calc4 = (mortgagePointsRate/100) * (Math.min(val*(maxLtvLoanRate/100), maxLtvLoan));
        if (e.target.id === 'purchase_price') {
            setPurchasePrice(val);
            setTitleInsuranceAq(calc);
            setTransferTax(calc1);
            setDesiredLtvLoan(calc2);
            setDesiredLtvLoanRate(calc3);
            setMortgagePoints(calc4);
            setFormData({ ...formData, 
                [e.target.id]: val,
                'title_insurance_aq': calc,
                'transfer_tax_aq': calc1,
                'loan_ltv_desired': calc2,
                'rate_ltv_desired': calc3,
                'mortgage_points': calc4
            });
        } else if (e.target.id === 'hold_period') {
            calc = val * 12;
            setHoldingPeriod(val);
            setHoldingPeriodM(calc)
            setFormData({ ...formData, 
                [e.target.id]: val, 
                'hold_period_m': calc
            });            
        }
    }

    /* State Manager for Rent Assumptions */ 
    const [apartmentRent, setApartmentRent] = useState(3000);
    const [parking, setParking] = useState(300);
    const [totalRent, setTotalRent] = useState(3300);
    const [rentersInsurance, setRentersInsurance] = useState(600);

    const handleRAInput = (e) => {
        const val = Number(e.target.value);
        let total = 0;
        switch(e.target.id) {
            case 'apartment_rent':
                total = parking + val; 
                setApartmentRent(val);
                setTotalRent(total);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'monthly_rent': total
                });
                break;
            case 'parking_rent':
                total = val + apartmentRent;
                setParking(val);
                setTotalRent(total);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'monthly_rent': total
                });
                break;
            case 'renters_insurance':
                setRentersInsurance(val);
                setFormData({ ...formData, [e.target.id]: val });
                break;
            default:
                break;
        }
    }

    /* State Manager for General Assumptions */ 
    const [capitalGains, setCapitalGains] = useState(20);
    const [federalTax, setFederalTax] = useState(35);
    const [federalTaxBool, setFederalTaxBool] = useState(true);
    const [saltLimit, setSaltLimit] = useState(10000);
    const [saltLimitBool, setSaltLimitBool] = useState(true);
    const [rentGrowth, setRentGrowth] = useState(3);
    const [homeAppreciation, setHomeAppreciation] = useState(3);
    const [retInflation, setRetInflation] = useState(3);
    const [otherInflation, setOtherInflation] = useState(3);

    const handleGAInput = (e) => {
        const val = Number(e.target.value);
        switch(e.target.id) {
            case 'rate_capital_gains': 
                setCapitalGains(val);
                setFormData({ ...formData, [e.target.id]: val });
                break;
            case 'rate_federal_tax':
                setFederalTax(val);
                setFormData({ ...formData, [e.target.id]: val });
                break;
            case 'salt_limit':
                setSaltLimit(val);
                setFormData({ ...formData, [e.target.id]: val });
                break;
            case 'rent_growth':
                setRentGrowth(val);
                setFormData({ ...formData, [e.target.id]: val });
                break;
            case 'home_appreciation':
                setHomeAppreciation(val);
                setFormData({ ...formData, [e.target.id]: val });
                break;
            case 'ret_inflation':
                setRetInflation(val);
                setFormData({ ...formData, [e.target.id]: val });
                break;
            case 'other_inflation':
                setOtherInflation(val);
                setFormData({ ...formData, [e.target.id]: val });
                break;
            default:
                break;
        }
    }; 

    const handleGACheck = (e) => {
        const check = e.target.checked;
        switch (e.target.id) {
            case 'bool_federal':
                setFederalTaxBool(check);
                setFormData({ ...formData, [e.target.id]: check }); // FYI this bool doesnt change (?)
                if (federalTaxBool) {
                    setFederalTax(0);
                    setFormData({ ...formData, 'rate_federal_tax': 0 });
                } else {
                    setFederalTax(35);
                    setFormData({ ...formData, 'rate_federal_tax': 35 });
                }
                break;
            case 'bool_salt':
                setSaltLimitBool(check);
                setFormData({ ...formData, [e.target.id]: check }); // FYI this bool doesnt change (?)
                if (saltLimitBool) {
                    setSaltLimit(0);
                    setFormData({ ...formData, 'salt_limit': 0 });
                } else {
                    setSaltLimit(10000);
                    setFormData({ ...formData, 'salt_limit': 10000 });
                }
                break;
            default:
                break;
        }
    };

    /* State Manager for Acquisition Costs */
    const [inspectionFee, setInspectionFee] = useState(1000);
    const [appraisalFee, setAppraisalFee] = useState(750);
    const [legalFee, setLegalFee] = useState(1500);
    const [titleInsuranceRateAq, setTitleInsuranceRateAq] = useState(0.5);
    const [titleInsuranceAq, setTitleInsuranceAq] = useState(2500);
    const [otherLenderCosts, setOtherLenderCosts] = useState(2000);
    const [transferTaxRate, setTransferTaxRate] = useState(0);
    const [transferTax, setTransferTax] = useState(0);
    const [totalAcquisition, setTotalAcquisition] = useState(7750);

    const handleACInput = (e) => {
        const val = Number(e.target.value);
        let total = 0;
        let calc = 0;
        switch(e.target.id) {
            case 'fee_inspection': 
                total = val + appraisalFee + legalFee + titleInsuranceAq + otherLenderCosts + transferTax
                setInspectionFee(val);
                setTotalAcquisition(total);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'total_acquisition': total
                });
                break;
            case 'fee_appraisal':
                total = val + inspectionFee + legalFee + titleInsuranceAq + otherLenderCosts + transferTax;
                setAppraisalFee(val);
                setTotalAcquisition(total);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'total_acquisition': total
                });
                break;
            case 'fee_legal':
                total = val + inspectionFee + appraisalFee + titleInsuranceAq + otherLenderCosts + transferTax;
                setLegalFee(val);
                setTotalAcquisition(total);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'total_acquisition': total
                });
                break;
            case 'rate_title_insurance_aq':
                calc = (val / 100) * purchasePrice;
                total = calc + inspectionFee + appraisalFee + legalFee + otherLenderCosts + transferTax
                setTitleInsuranceRateAq(val);
                setTitleInsuranceAq(calc);
                setTotalAcquisition(total);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'title_insurance_aq': calc,
                    'total_acquisition': total
                });
                break;
            case 'title_insurance_aq':
                total = val + inspectionFee + appraisalFee + legalFee + otherLenderCosts + transferTax
                calc = (val / purchasePrice) * 100;
                setTitleInsuranceAq(val);
                setTitleInsuranceRateAq(calc);
                setTotalAcquisition(total);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'rate_title_insurance_aq': calc,
                    'total_acquisition': total
                });
                break;
            case 'lender_costs_other':
                total = val + inspectionFee + appraisalFee + legalFee + titleInsuranceAq + transferTax;
                setOtherLenderCosts(val);
                setTotalAcquisition(total);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'total_acquisition': total
                });
                break;
            case 'rate_transfer_tax_aq':
                calc = (val / 100) * purchasePrice;
                total = calc + inspectionFee + appraisalFee + legalFee + titleInsuranceAq + otherLenderCosts;
                setTransferTaxRate(val);
                setTransferTax(calc);
                setTotalAcquisition(total);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'transfer_tax_aq': calc,
                    'total_acquisition': total
                });
                break;
            case 'transfer_tax_aq':
                total = val + inspectionFee + appraisalFee + legalFee + titleInsuranceAq + otherLenderCosts;
                calc = (val / purchasePrice) * 100;
                setTransferTax(val);
                setTransferTaxRate(calc);
                setTotalAcquisition(total);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'rate_transfer_tax_aq': calc,
                    'total_acquisition': total
                });
                break;
            default:
                break;
        }
    }

    /* State Manager for Disposition Costs */
    const grossSale = purchasePrice * Math.pow((1 + (homeAppreciation/100)),holdingPeriod);
    /* const [grossSale, setGrossSale] = useState() */
    const [titleInsuranceRateDis, setTitleInsuranceRateDis] = useState(0);
    const [titleInsuranceDis, setTitleInsuranceDis] = useState(0);
    const [transferTaxRateDis, setTransferTaxRateDis] = useState(0);
    const [transferTaxDis, setTransferTaxDis] = useState(0);
    const [brokerageRate, setBrokerageRate] = useState(5.5);
    const [brokerageFee, setBrokerageFee] = useState(31880);
    const [totalDisposition, setTotalDisposition] = useState(31880);

    const handleDCInput = (e) => {
        const val = Number(e.target.value);
        let total = 0;
        let calc = 0;
        switch(e.target.id) {
            case 'rate_title_insurance_dis':
                calc = val/100 * grossSale;
                total = calc + transferTaxDis + brokerageFee;
                setTitleInsuranceRateDis(val);
                setTitleInsuranceDis(calc);
                setTotalDisposition(total);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'title_insurance_dis': calc,
                    'total_disposition': total
                });
                break;
            case 'title_insurance_dis':
                calc = val/grossSale * 100;
                total = val + transferTaxDis + brokerageFee;
                setTitleInsuranceDis(val);
                setTitleInsuranceRateDis(calc);
                setTotalDisposition(total);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'rate_title_insurance_dis': calc,
                    'total_disposition': total
                });
                break;
            case 'rate_transfer_tax_dis':
                calc = val/100 * grossSale;
                total = calc + titleInsuranceDis + brokerageFee;
                setTransferTaxRateDis(val);
                setTransferTaxDis(calc);
                setTotalDisposition(total);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'transfer_tax_dis': calc,
                    'total_disposition': total
                });
                break;
            case 'transfer_tax_dis':
                calc = (val/grossSale) * 100;
                total = val + titleInsuranceDis + brokerageFee;
                setTransferTaxDis(val);
                setTransferTaxRateDis(calc);
                setTotalDisposition(total);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'rate_transfer_tax_dis': calc,
                    'total_disposition': total
                });
                break;
            case 'rate_brokerage':
                calc = val/100 * grossSale;
                total = calc + titleInsuranceDis + transferTaxDis;
                setBrokerageRate(val);
                setBrokerageFee(calc);
                setTotalDisposition(total);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'fee_brokerage': calc,
                    'total_disposition': total
                });
                break;
            case 'fee_brokerage':
                calc = (val/grossSale) * 100;
                total = val + titleInsuranceDis + transferTaxDis;
                setBrokerageFee(val);
                setBrokerageRate(calc);
                setTotalDisposition(total);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'rate_brokerage': calc,
                    'total_disposition': total
                });
                break;
            default:
                break;
        }
    };

    /* State Manager for Operating Costs */
    const [propertyTaxRate, setPropertyTaxRate] = useState(0.6);
    const [propertyTax, setPropertyTax] = useState(3000);
    const [homeInsuranceRate, setHomeInsuranceRate] = useState(0.6);
    const [homeInsurance, setHomeInsurance] = useState(3000);
    const [maintenanceRate, setMaintenanceRate] = useState(1)
    const [homeMaintenance, setHomeMaintenance] = useState(5000);
    const [hoaUtilityRate, setHoaUtilityRate] = useState(0.25);
    const [hoaUtility, sethoaUtility] = useState(104);

    const handleOCInput = (e) => {
        const val = Number(e.target.value);
        let calc = 0;
        switch(e.target.id) {
            case 'rate_property_tax':
                calc = (val/100) * purchasePrice;
                setPropertyTaxRate(val);
                setPropertyTax(calc);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'property_tax': calc
                });
                break;
            case 'property_tax':
                calc = (val/purchasePrice) * 100;
                setPropertyTax(val);
                setPropertyTaxRate(calc);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'rate_property_tax': calc
                });
                break;
            case 'rate_home_insurance':
                calc = (val/100) * purchasePrice;
                setHomeInsuranceRate(val);
                setHomeInsurance(calc);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'home_insurance': calc
                });
                break;
            case 'home_insurance':
                calc = (val/purchasePrice) * 100;
                setHomeInsurance(val);
                setHomeInsuranceRate(calc);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'rate_home_insurance': calc
                });
                break;
            case 'rate_home_maintenance':
                calc = (val/100) * purchasePrice;
                setMaintenanceRate(val);
                setHomeMaintenance(calc);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'home_maintenance': calc
                });
                break;
            case 'home_maintenance':
                calc = (val/purchasePrice) * 100;
                setHomeMaintenance(val);
                setMaintenanceRate(calc);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'rate_home_maintenance': calc
                });
                break;
            case 'rate_hoa_util':
                calc = val/100 * purchasePrice;
                setHoaUtilityRate(val);
                sethoaUtility(calc);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'hoa_util': calc
                });
                break;
            case 'hoa_util':
                calc = (val/purchasePrice) * 100;
                sethoaUtility(val);
                setHoaUtilityRate(calc);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'rate_hoa_util': calc
                });
                break;
            default:
                break;
        }
    };

    /* State Manager for Loan Assumptions */
    const [maxLtvLoanRate, setMaxLtvLoanRate] = useState(80);
    const [maxLtvLoan, setMaxLtvLoan] = useState(787750);
    const [desiredLtvLoan, setDesiredLtvLoan] = useState(400000);
    const [desiredLtvLoanRate, setDesiredLtvLoanRate] = useState(80);
    const [loanInterestRate, setLoanInterestRate] = useState(7);
    const [amortPeriod, setAmortPeriod] = useState(30);
    const [mortgageInsuranceRate, setMortgageInsuranceRate] = useState(5);
    const [mortgageInsuranceClear, setMortgageInsuranceClear] = useState(80);
    const [mortgagePointsRate, setMortgagePointsRate] = useState(1);
    const [mortgagePoints, setMortgagePoints] = useState(4000);

    const handleLAInput = (e) => {
        let val = Number(e.target.value);
        let calc = 0;
        let calc1 = 0;
        let calc2 = 0;
        switch(e.target.id) {
            case 'rate_ltv_max':
                calc = Math.min(purchasePrice*(val), maxLtvLoan);
                calc1 = Math.min(val, (maxLtvLoan/purchasePrice)*100);
                calc2 = (mortgagePointsRate/100) * (Math.min(purchasePrice*(val/100), maxLtvLoan));
                setMaxLtvLoanRate(val);
                setDesiredLtvLoan(calc);
                setDesiredLtvLoanRate(calc1);
                setMortgagePoints(calc2);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'loan_ltv_desired': calc,
                    'rate_ltv_desired': calc1,
                    'mortgage_points': calc2
                });
                break;
            case 'loan_ltv_max':
                calc = Math.min(purchasePrice*(maxLtvLoanRate/100), val);
                calc1 = Math.min(maxLtvLoanRate, (val/purchasePrice)*100);
                calc2 = (mortgagePointsRate/100) * (Math.min(purchasePrice*(maxLtvLoanRate/100), val));
                setMaxLtvLoan(val);
                setDesiredLtvLoan(calc);
                setDesiredLtvLoanRate(calc1);
                setMortgagePoints(calc2);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'loan_ltv_desired': calc,
                    'rate_ltv_desired': calc1,
                    'mortgage_points': calc2
                });
                break;
            case 'rate_home_loan':
                setLoanInterestRate(val);
                setFormData({ ...formData, [e.target.id]: val});
                break;
            case 'amort_home_loan':
                setAmortPeriod(val);
                setFormData({ ...formData, [e.target.id]: val});
                break;
            case 'rate_mortgage_insurance':
                setMortgageInsuranceRate(val);
                setFormData({ ...formData, [e.target.id]: val});
                break;
            case 'clear_mortgage_insurance':
                setMortgageInsuranceClear(val);
                setFormData({ ...formData, [e.target.id]: val});
                break;
            case 'rate_mortgage_points':
                calc = (val/100) * desiredLtvLoan;
                setMortgagePointsRate(val);
                setMortgagePoints(calc);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'mortgage_points': calc
                });
                break;
            case 'mortgage_points':
                calc = (val/desiredLtvLoan) * 100;
                setMortgagePoints(val);
                setMortgagePointsRate(calc);
                setFormData({ ...formData, 
                    [e.target.id]: val,
                    'rate_mortgage_points': calc
                });
                break;
            default:
                break;
        }
    };

    const [mcfTable, setMCFTable] = useState(
        [`
            <table id="mcfTable"><thead><tr><th class="mainHeader">Years</th><td class="secondHeader">0</td><td class="secondHeader" colspan="12">1</td><td class="secondHeader" colspan="12">2</td><td class="secondHeader" colspan="12">3</td><td class="secondHeader" colspan="12">4</td><td class="secondHeader" colspan="12">5</td></tr><tr><th class="mainHeader">Months</th><td class="secondHeader">0</td><td class="secondHeader">1</td><td class="secondHeader">2</td><td class="secondHeader">3</td><td class="secondHeader">4</td><td class="secondHeader">5</td><td class="secondHeader">6</td><td class="secondHeader">7</td><td class="secondHeader">8</td><td class="secondHeader">9</td><td class="secondHeader">10</td><td class="secondHeader">11</td><td class="secondHeader">12</td><td class="secondHeader">13</td><td class="secondHeader">14</td><td class="secondHeader">15</td><td class="secondHeader">16</td><td class="secondHeader">17</td><td class="secondHeader">18</td><td class="secondHeader">19</td><td class="secondHeader">20</td><td class="secondHeader">21</td><td class="secondHeader">22</td><td class="secondHeader">23</td><td class="secondHeader">24</td><td class="secondHeader">25</td><td class="secondHeader">26</td><td class="secondHeader">27</td><td class="secondHeader">28</td><td class="secondHeader">29</td><td class="secondHeader">30</td><td class="secondHeader">31</td><td class="secondHeader">32</td><td class="secondHeader">33</td><td class="secondHeader">34</td><td class="secondHeader">35</td><td class="secondHeader">36</td><td class="secondHeader">37</td><td class="secondHeader">38</td><td class="secondHeader">39</td><td class="secondHeader">40</td><td class="secondHeader">41</td><td class="secondHeader">42</td><td class="secondHeader">43</td><td class="secondHeader">44</td><td class="secondHeader">45</td><td class="secondHeader">46</td><td class="secondHeader">47</td><td class="secondHeader">48</td><td class="secondHeader">49</td><td class="secondHeader">50</td><td class="secondHeader">51</td><td class="secondHeader">52</td><td class="secondHeader">53</td><td class="secondHeader">54</td><td class="secondHeader">55</td><td class="secondHeader">56</td><td class="secondHeader">57</td><td class="secondHeader">58</td><td class="secondHeader">59</td><td class="secondHeader">60</td></tr></thead><tbody><tr class="tableRow"><th class="minorHeader">Monthly Rent</th><td>0.00</td><td>-3300.00</td><td>-3300.00</td><td>-3300.00</td><td>-3300.00</td><td>-3300.00</td><td>-3300.00</td><td>-3300.00</td><td>-3300.00</td><td>-3300.00</td><td>-3300.00</td><td>-3300.00</td><td>-3300.00</td><td>-3399.00</td><td>-3399.00</td><td>-3399.00</td><td>-3399.00</td><td>-3399.00</td><td>-3399.00</td><td>-3399.00</td><td>-3399.00</td><td>-3399.00</td><td>-3399.00</td><td>-3399.00</td><td>-3399.00</td><td>-3500.97</td><td>-3500.97</td><td>-3500.97</td><td>-3500.97</td><td>-3500.97</td><td>-3500.97</td><td>-3500.97</td><td>-3500.97</td><td>-3500.97</td><td>-3500.97</td><td>-3500.97</td><td>-3500.97</td><td>-3606.00</td><td>-3606.00</td><td>-3606.00</td><td>-3606.00</td><td>-3606.00</td><td>-3606.00</td><td>-3606.00</td><td>-3606.00</td><td>-3606.00</td><td>-3606.00</td><td>-3606.00</td><td>-3606.00</td><td>-3714.18</td><td>-3714.18</td><td>-3714.18</td><td>-3714.18</td><td>-3714.18</td><td>-3714.18</td><td>-3714.18</td><td>-3714.18</td><td>-3714.18</td><td>-3714.18</td><td>-3714.18</td><td>-3714.18</td></tr><tr class="tableRow"><th class="minorHeader">Renter's Insurance</th><td>0.00</td><td>-50.00</td><td>-50.00</td><td>-50.00</td><td>-50.00</td><td>-50.00</td><td>-50.00</td><td>-50.00</td><td>-50.00</td><td>-50.00</td><td>-50.00</td><td>-50.00</td><td>-50.00</td><td>-51.50</td><td>-51.50</td><td>-51.50</td><td>-51.50</td><td>-51.50</td><td>-51.50</td><td>-51.50</td><td>-51.50</td><td>-51.50</td><td>-51.50</td><td>-51.50</td><td>-51.50</td><td>-53.04</td><td>-53.04</td><td>-53.04</td><td>-53.04</td><td>-53.04</td><td>-53.04</td><td>-53.04</td><td>-53.04</td><td>-53.04</td><td>-53.04</td><td>-53.04</td><td>-53.04</td><td>-54.63</td><td>-54.63</td><td>-54.63</td><td>-54.63</td><td>-54.63</td><td>-54.63</td><td>-54.63</td><td>-54.63</td><td>-54.63</td><td>-54.63</td><td>-54.63</td><td>-54.63</td><td>-56.27</td><td>-56.27</td><td>-56.27</td><td>-56.27</td><td>-56.27</td><td>-56.27</td><td>-56.27</td><td>-56.27</td><td>-56.27</td><td>-56.27</td><td>-56.27</td><td>-56.27</td></tr><tr class="tableRow"><th class="minorHeader">Renter's Cash Flow</th><td>0.00</td><td>-3350.00</td><td>-3350.00</td><td>-3350.00</td><td>-3350.00</td><td>-3350.00</td><td>-3350.00</td><td>-3350.00</td><td>-3350.00</td><td>-3350.00</td><td>-3350.00</td><td>-3350.00</td><td>-3350.00</td><td>-3450.50</td><td>-3450.50</td><td>-3450.50</td><td>-3450.50</td><td>-3450.50</td><td>-3450.50</td><td>-3450.50</td><td>-3450.50</td><td>-3450.50</td><td>-3450.50</td><td>-3450.50</td><td>-3450.50</td><td>-3554.01</td><td>-3554.01</td><td>-3554.01</td><td>-3554.01</td><td>-3554.01</td><td>-3554.01</td><td>-3554.01</td><td>-3554.01</td><td>-3554.01</td><td>-3554.01</td><td>-3554.01</td><td>-3554.01</td><td>-3660.63</td><td>-3660.63</td><td>-3660.63</td><td>-3660.63</td><td>-3660.63</td><td>-3660.63</td><td>-3660.63</td><td>-3660.63</td><td>-3660.63</td><td>-3660.63</td><td>-3660.63</td><td>-3660.63</td><td>-3770.45</td><td>-3770.45</td><td>-3770.45</td><td>-3770.45</td><td>-3770.45</td><td>-3770.45</td><td>-3770.45</td><td>-3770.45</td><td>-3770.45</td><td>-3770.45</td><td>-3770.45</td><td>-3770.45</td></tr><tr class="tableRow"><th class="minorHeader">Acquisition</th><td>-500000.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td></tr><tr class="tableRow"><th class="minorHeader">Acquisition Costs</th><td>-7750.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td></tr><tr class="tableRow"><th class="minorHeader">Sale</th><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>579637.04</td></tr><tr class="tableRow"><th class="minorHeader">Disposition Costs</th><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>-31880.00</td></tr><tr class="tableRow"><th class="minorHeader">Property Tax</th><td>0.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td></tr><tr class="tableRow"><th class="minorHeader">Property Tax Shield</th><td>0.00</td><td>87.50</td><td>87.50</td><td>87.50</td><td>87.50</td><td>87.50</td><td>87.50</td><td>87.50</td><td>87.50</td><td>87.50</td><td>87.50</td><td>87.50</td><td>87.50</td><td>90.12</td><td>90.12</td><td>90.12</td><td>90.12</td><td>90.12</td><td>90.12</td><td>90.12</td><td>90.12</td><td>90.12</td><td>90.12</td><td>90.12</td><td>90.12</td><td>92.83</td><td>92.83</td><td>92.83</td><td>92.83</td><td>92.83</td><td>92.83</td><td>92.83</td><td>92.83</td><td>92.83</td><td>92.83</td><td>92.83</td><td>92.83</td><td>95.61</td><td>95.61</td><td>95.61</td><td>95.61</td><td>95.61</td><td>95.61</td><td>95.61</td><td>95.61</td><td>95.61</td><td>95.61</td><td>95.61</td><td>95.61</td><td>98.48</td><td>98.48</td><td>98.48</td><td>98.48</td><td>98.48</td><td>98.48</td><td>98.48</td><td>98.48</td><td>98.48</td><td>98.48</td><td>98.48</td><td>98.48</td></tr><tr class="tableRow"><th class="minorHeader">Insurance</th><td>0.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-250.00</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-257.50</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-265.22</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-273.18</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td><td>-281.38</td></tr><tr class="tableRow"><th class="minorHeader">Maintenance</th><td>0.00</td><td>-416.67</td><td>-416.67</td><td>-416.67</td><td>-416.67</td><td>-416.67</td><td>-416.67</td><td>-416.67</td><td>-416.67</td><td>-416.67</td><td>-416.67</td><td>-416.67</td><td>-416.67</td><td>-429.17</td><td>-429.17</td><td>-429.17</td><td>-429.17</td><td>-429.17</td><td>-429.17</td><td>-429.17</td><td>-429.17</td><td>-429.17</td><td>-429.17</td><td>-429.17</td><td>-429.17</td><td>-442.04</td><td>-442.04</td><td>-442.04</td><td>-442.04</td><td>-442.04</td><td>-442.04</td><td>-442.04</td><td>-442.04</td><td>-442.04</td><td>-442.04</td><td>-442.04</td><td>-442.04</td><td>-455.30</td><td>-455.30</td><td>-455.30</td><td>-455.30</td><td>-455.30</td><td>-455.30</td><td>-455.30</td><td>-455.30</td><td>-455.30</td><td>-455.30</td><td>-455.30</td><td>-455.30</td><td>-468.96</td><td>-468.96</td><td>-468.96</td><td>-468.96</td><td>-468.96</td><td>-468.96</td><td>-468.96</td><td>-468.96</td><td>-468.96</td><td>-468.96</td><td>-468.96</td><td>-468.96</td></tr><tr class="tableRow"><th class="minorHeader">Condo Dues</th><td>0.00</td><td>-104.00</td><td>-104.00</td><td>-104.00</td><td>-104.00</td><td>-104.00</td><td>-104.00</td><td>-104.00</td><td>-104.00</td><td>-104.00</td><td>-104.00</td><td>-104.00</td><td>-104.00</td><td>-107.12</td><td>-107.12</td><td>-107.12</td><td>-107.12</td><td>-107.12</td><td>-107.12</td><td>-107.12</td><td>-107.12</td><td>-107.12</td><td>-107.12</td><td>-107.12</td><td>-107.12</td><td>-110.33</td><td>-110.33</td><td>-110.33</td><td>-110.33</td><td>-110.33</td><td>-110.33</td><td>-110.33</td><td>-110.33</td><td>-110.33</td><td>-110.33</td><td>-110.33</td><td>-110.33</td><td>-113.64</td><td>-113.64</td><td>-113.64</td><td>-113.64</td><td>-113.64</td><td>-113.64</td><td>-113.64</td><td>-113.64</td><td>-113.64</td><td>-113.64</td><td>-113.64</td><td>-113.64</td><td>-117.05</td><td>-117.05</td><td>-117.05</td><td>-117.05</td><td>-117.05</td><td>-117.05</td><td>-117.05</td><td>-117.05</td><td>-117.05</td><td>-117.05</td><td>-117.05</td><td>-117.05</td></tr><tr class="tableRow"><th class="minorHeader">Unlevered Owner Cash Flow</th><td>-507750.00</td><td>-933.17</td><td>-933.17</td><td>-933.17</td><td>-933.17</td><td>-933.17</td><td>-933.17</td><td>-933.17</td><td>-933.17</td><td>-933.17</td><td>-933.17</td><td>-933.17</td><td>-933.17</td><td>-961.16</td><td>-961.16</td><td>-961.16</td><td>-961.16</td><td>-961.16</td><td>-961.16</td><td>-961.16</td><td>-961.16</td><td>-961.16</td><td>-961.16</td><td>-961.16</td><td>-961.16</td><td>-990.00</td><td>-990.00</td><td>-990.00</td><td>-990.00</td><td>-990.00</td><td>-990.00</td><td>-990.00</td><td>-990.00</td><td>-990.00</td><td>-990.00</td><td>-990.00</td><td>-990.00</td><td>-1019.70</td><td>-1019.70</td><td>-1019.70</td><td>-1019.70</td><td>-1019.70</td><td>-1019.70</td><td>-1019.70</td><td>-1019.70</td><td>-1019.70</td><td>-1019.70</td><td>-1019.70</td><td>-1019.70</td><td>-1050.29</td><td>-1050.29</td><td>-1050.29</td><td>-1050.29</td><td>-1050.29</td><td>-1050.29</td><td>-1050.29</td><td>-1050.29</td><td>-1050.29</td><td>-1050.29</td><td>-1050.29</td><td>546706.75</td></tr><tr class="tableRow"><th class="minorHeader">Unlevered Net Cash Flow</th><td>-507750.00</td><td>2416.83</td><td>2416.83</td><td>2416.83</td><td>2416.83</td><td>2416.83</td><td>2416.83</td><td>2416.83</td><td>2416.83</td><td>2416.83</td><td>2416.83</td><td>2416.83</td><td>2416.83</td><td>2489.34</td><td>2489.34</td><td>2489.34</td><td>2489.34</td><td>2489.34</td><td>2489.34</td><td>2489.34</td><td>2489.34</td><td>2489.34</td><td>2489.34</td><td>2489.34</td><td>2489.34</td><td>2564.01</td><td>2564.01</td><td>2564.01</td><td>2564.01</td><td>2564.01</td><td>2564.01</td><td>2564.01</td><td>2564.01</td><td>2564.01</td><td>2564.01</td><td>2564.01</td><td>2564.01</td><td>2640.93</td><td>2640.93</td><td>2640.93</td><td>2640.93</td><td>2640.93</td><td>2640.93</td><td>2640.93</td><td>2640.93</td><td>2640.93</td><td>2640.93</td><td>2640.93</td><td>2640.93</td><td>2720.16</td><td>2720.16</td><td>2720.16</td><td>2720.16</td><td>2720.16</td><td>2720.16</td><td>2720.16</td><td>2720.16</td><td>2720.16</td><td>2720.16</td><td>2720.16</td><td>550477.20</td></tr><tr class="tableRow"><th class="minorHeader">Loan Proceeds</th><td>400000.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td></tr><tr class="tableRow"><th class="minorHeader">Loan Repayment</th><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>-374736.29</td></tr><tr class="tableRow"><th class="minorHeader">Amortization</th><td>0.00</td><td>-352.88</td><td>-354.94</td><td>-357.01</td><td>-359.09</td><td>-361.19</td><td>-363.29</td><td>-365.41</td><td>-367.54</td><td>-369.69</td><td>-371.84</td><td>-374.01</td><td>-376.20</td><td>-378.39</td><td>-380.60</td><td>-382.82</td><td>-385.05</td><td>-387.30</td><td>-389.56</td><td>-391.83</td><td>-394.11</td><td>-396.41</td><td>-398.73</td><td>-401.05</td><td>-403.39</td><td>-405.74</td><td>-408.11</td><td>-410.49</td><td>-412.89</td><td>-415.29</td><td>-417.72</td><td>-420.15</td><td>-422.60</td><td>-425.07</td><td>-427.55</td><td>-430.04</td><td>-432.55</td><td>-435.07</td><td>-437.61</td><td>-440.17</td><td>-442.73</td><td>-445.32</td><td>-447.91</td><td>-450.53</td><td>-453.15</td><td>-455.80</td><td>-458.46</td><td>-461.13</td><td>-463.82</td><td>-466.53</td><td>-469.25</td><td>-471.99</td><td>-474.74</td><td>-477.51</td><td>-480.29</td><td>-483.09</td><td>-485.91</td><td>-488.75</td><td>-491.60</td><td>-494.47</td><td>-497.35</td></tr><tr class="tableRow"><th class="minorHeader">Loan Points</th><td>-4000.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td></tr><tr class="tableRow"><th class="minorHeader">Interest</th><td>0.00</td><td>-2333.33</td><td>-2331.27</td><td>-2329.20</td><td>-2327.12</td><td>-2325.03</td><td>-2322.92</td><td>-2320.80</td><td>-2318.67</td><td>-2316.53</td><td>-2314.37</td><td>-2312.20</td><td>-2310.02</td><td>-2307.82</td><td>-2305.62</td><td>-2303.40</td><td>-2301.16</td><td>-2298.92</td><td>-2296.66</td><td>-2294.39</td><td>-2292.10</td><td>-2289.80</td><td>-2287.49</td><td>-2285.16</td><td>-2282.82</td><td>-2280.47</td><td>-2278.10</td><td>-2275.72</td><td>-2273.33</td><td>-2270.92</td><td>-2268.50</td><td>-2266.06</td><td>-2263.61</td><td>-2261.14</td><td>-2258.66</td><td>-2256.17</td><td>-2253.66</td><td>-2251.14</td><td>-2248.60</td><td>-2246.05</td><td>-2243.48</td><td>-2240.90</td><td>-2238.30</td><td>-2235.69</td><td>-2233.06</td><td>-2230.42</td><td>-2227.76</td><td>-2225.08</td><td>-2222.39</td><td>-2219.69</td><td>-2216.97</td><td>-2214.23</td><td>-2211.48</td><td>-2208.71</td><td>-2205.92</td><td>-2203.12</td><td>-2200.30</td><td>-2197.47</td><td>-2194.61</td><td>-2191.75</td><td>-2188.86</td></tr><tr class="tableRow"><th class="minorHeader">Interest Tax Shield</th><td>0.00</td><td>816.67</td><td>815.95</td><td>815.22</td><td>814.49</td><td>813.76</td><td>813.02</td><td>812.28</td><td>811.53</td><td>810.78</td><td>810.03</td><td>809.27</td><td>808.51</td><td>807.74</td><td>806.97</td><td>806.19</td><td>805.41</td><td>804.62</td><td>803.83</td><td>803.03</td><td>802.23</td><td>801.43</td><td>800.62</td><td>799.81</td><td>798.99</td><td>798.16</td><td>797.34</td><td>796.50</td><td>795.66</td><td>794.82</td><td>793.97</td><td>793.12</td><td>792.26</td><td>791.40</td><td>790.53</td><td>789.66</td><td>788.78</td><td>787.90</td><td>787.01</td><td>786.12</td><td>785.22</td><td>784.31</td><td>783.40</td><td>782.49</td><td>781.57</td><td>780.65</td><td>779.71</td><td>778.78</td><td>777.84</td><td>776.89</td><td>775.94</td><td>774.98</td><td>774.02</td><td>773.05</td><td>772.07</td><td>771.09</td><td>770.11</td><td>769.11</td><td>768.12</td><td>767.11</td><td>766.10</td></tr><tr class="tableRow"><th class="minorHeader">Mortgage Insurance</th><td>0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td><td>-0.00</td></tr><tr class="tableRow"><th class="minorHeader">Levered Owner Cash Flow</th><td>-111750.00</td><td>-2802.71</td><td>-2803.43</td><td>-2804.16</td><td>-2804.89</td><td>-2805.62</td><td>-2806.36</td><td>-2807.10</td><td>-2807.85</td><td>-2808.60</td><td>-2809.35</td><td>-2810.11</td><td>-2810.87</td><td>-2839.64</td><td>-2840.41</td><td>-2841.19</td><td>-2841.97</td><td>-2842.75</td><td>-2843.54</td><td>-2844.34</td><td>-2845.14</td><td>-2845.94</td><td>-2846.75</td><td>-2847.57</td><td>-2848.39</td><td>-2878.05</td><td>-2878.87</td><td>-2879.71</td><td>-2880.55</td><td>-2881.39</td><td>-2882.24</td><td>-2883.09</td><td>-2883.95</td><td>-2884.81</td><td>-2885.68</td><td>-2886.55</td><td>-2887.43</td><td>-2918.01</td><td>-2918.90</td><td>-2919.79</td><td>-2920.69</td><td>-2921.60</td><td>-2922.50</td><td>-2923.42</td><td>-2924.34</td><td>-2925.26</td><td>-2926.19</td><td>-2927.13</td><td>-2928.07</td><td>-2959.61</td><td>-2960.56</td><td>-2961.52</td><td>-2962.48</td><td>-2963.45</td><td>-2964.43</td><td>-2965.41</td><td>-2966.40</td><td>-2967.39</td><td>-2968.39</td><td>-2969.39</td><td>170050.35</td></tr><tr class="tableRow"><th class="minorHeader">Levered Net Cash Flow</th><td>-111750.00</td><td>547.29</td><td>546.57</td><td>545.84</td><td>545.11</td><td>544.38</td><td>543.64</td><td>542.90</td><td>542.15</td><td>541.40</td><td>540.65</td><td>539.89</td><td>539.13</td><td>610.86</td><td>610.09</td><td>609.31</td><td>608.53</td><td>607.75</td><td>606.96</td><td>606.16</td><td>605.36</td><td>604.56</td><td>603.75</td><td>602.93</td><td>602.11</td><td>675.96</td><td>675.14</td><td>674.30</td><td>673.46</td><td>672.62</td><td>671.77</td><td>670.92</td><td>670.06</td><td>669.20</td><td>668.33</td><td>667.46</td><td>666.58</td><td>742.62</td><td>741.73</td><td>740.84</td><td>739.94</td><td>739.03</td><td>738.13</td><td>737.21</td><td>736.29</td><td>735.37</td><td>734.44</td><td>733.50</td><td>732.56</td><td>810.84</td><td>809.89</td><td>808.93</td><td>807.97</td><td>807.00</td><td>806.02</td><td>805.04</td><td>804.05</td><td>803.06</td><td>802.06</td><td>801.06</td><td>173820.80</td></tr><tr class="tableRow"><th class="minorHeader">Cum. Gross Equity</th><td>-111750.00</td><td>-114552.71</td><td>-117356.15</td><td>-120160.31</td><td>-122965.19</td><td>-125770.81</td><td>-128577.17</td><td>-131384.27</td><td>-134192.12</td><td>-137000.71</td><td>-139810.06</td><td>-142620.18</td><td>-145431.05</td><td>-148270.69</td><td>-151111.10</td><td>-153952.28</td><td>-156794.25</td><td>-159637.00</td><td>-162480.55</td><td>-165324.89</td><td>-168170.03</td><td>-171015.97</td><td>-173862.73</td><td>-176710.30</td><td>-179558.68</td><td>-182436.73</td><td>-185315.60</td><td>-188195.31</td><td>-191075.86</td><td>-193957.24</td><td>-196839.48</td><td>-199722.57</td><td>-202606.52</td><td>-205491.33</td><td>-208377.00</td><td>-211263.55</td><td>-214150.98</td><td>-217068.99</td><td>-219987.89</td><td>-222907.69</td><td>-225828.38</td><td>-228749.97</td><td>-231672.48</td><td>-234595.90</td><td>-237520.24</td><td>-240445.50</td><td>-243371.70</td><td>-246298.83</td><td>-249226.90</td><td>-252186.51</td><td>-255147.07</td><td>-258108.59</td><td>-261071.08</td><td>-264034.53</td><td>-266998.96</td><td>-269964.37</td><td>-272930.77</td><td>-275898.15</td><td>-278866.54</td><td>-281835.93</td><td>-111785.58</td></tr><tr class="tableRow"><th class="minorHeader">Cum. Net Equity</th><td>-111750.00</td><td>-111202.71</td><td>-110656.15</td><td>-110110.31</td><td>-109565.19</td><td>-109020.81</td><td>-108477.17</td><td>-107934.27</td><td>-107392.12</td><td>-106850.71</td><td>-106310.06</td><td>-105770.18</td><td>-105231.05</td><td>-104620.19</td><td>-104010.10</td><td>-103400.78</td><td>-102792.25</td><td>-102184.50</td><td>-101577.55</td><td>-100971.39</td><td>-100366.03</td><td>-99761.47</td><td>-99157.73</td><td>-98554.80</td><td>-97952.68</td><td>-97276.72</td><td>-96601.58</td><td>-95927.28</td><td>-95253.82</td><td>-94581.19</td><td>-93909.42</td><td>-93238.50</td><td>-92568.44</td><td>-91899.24</td><td>-91230.90</td><td>-90563.44</td><td>-89896.86</td><td>-89154.24</td><td>-88412.51</td><td>-87671.68</td><td>-86931.74</td><td>-86192.70</td><td>-85454.58</td><td>-84717.37</td><td>-83981.08</td><td>-83245.71</td><td>-82511.28</td><td>-81777.78</td><td>-81045.22</td><td>-80234.38</td><td>-79424.49</td><td>-78615.56</td><td>-77807.60</td><td>-77000.60</td><td>-76194.58</td><td>-75389.54</td><td>-74585.49</td><td>-73782.42</td><td>-72980.36</td><td>-72179.30</td><td>101641.50</td></tr></tbody></table>
        `]
    )

    const [acfTable, setACFTable] = useState(
        [`
            <table id="acfTable"><thead><tr><th class="mainACFHeader">Years</th><td class="secondACFHeader">0</td><td class="secondACFHeader">1</td><td class="secondACFHeader">2</td><td class="secondACFHeader">3</td><td class="secondACFHeader">4</td><td class="secondACFHeader">5</td></tr><tr><th class="mainACFHeader">Months</th><td class="secondACFHeader">0</td><td class="secondACFHeader">12</td><td class="secondACFHeader">24</td><td class="secondACFHeader">36</td><td class="secondACFHeader">48</td><td class="secondACFHeader">60</td></tr></thead><tbody><tr class="tableRow"><th class="minorHeader">Monthly Rent</th><td>0.00</td><td>-39600.00</td><td>-40788.00</td><td>-42011.64</td><td>-43272.00</td><td>-44570.16</td></tr><tr class="tableRow"><th class="minorHeader">Renter's Insurance</th><td>0.00</td><td>-600.00</td><td>-618.00</td><td>-636.48</td><td>-655.56</td><td>-675.24</td></tr><tr class="tableRow"><th class="minorHeader">Renter's Cash Flow</th><td>0.00</td><td>-40200.00</td><td>-41406.00</td><td>-42648.12</td><td>-43927.56</td><td>-45245.40</td></tr><tr class="tableRow"><th class="minorHeader">Acquisition</th><td>-500000.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td></tr><tr class="tableRow"><th class="minorHeader">Acquisition Costs</th><td>-7750.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td></tr><tr class="tableRow"><th class="minorHeader">Sale</th><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>579637.04</td></tr><tr class="tableRow"><th class="minorHeader">Disposition Costs</th><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>-31880.00</td></tr><tr class="tableRow"><th class="minorHeader">Property Tax</th><td>0.00</td><td>-3000.00</td><td>-3090.00</td><td>-3182.70</td><td>-3278.18</td><td>-3376.53</td></tr><tr class="tableRow"><th class="minorHeader">Property Tax Shield</th><td>0.00</td><td>1050.00</td><td>1081.50</td><td>1113.94</td><td>1147.36</td><td>1181.78</td></tr><tr class="tableRow"><th class="minorHeader">Insurance</th><td>0.00</td><td>-3000.00</td><td>-3090.00</td><td>-3182.70</td><td>-3278.18</td><td>-3376.53</td></tr><tr class="tableRow"><th class="minorHeader">Maintenance</th><td>0.00</td><td>-5000.00</td><td>-5150.00</td><td>-5304.50</td><td>-5463.64</td><td>-5627.54</td></tr><tr class="tableRow"><th class="minorHeader">Condo Dues</th><td>0.00</td><td>-1248.00</td><td>-1285.44</td><td>-1324.00</td><td>-1363.72</td><td>-1404.63</td></tr><tr class="tableRow"><th class="minorHeader">Unlevered Owner Cash Flow</th><td>-507750.00</td><td>-11198.00</td><td>-11533.94</td><td>-11879.96</td><td>-12236.36</td><td>535153.59</td></tr><tr class="tableRow"><th class="minorHeader">Unlevered Net Cash Flow</th><td>-507750.00</td><td>29002.00</td><td>29872.06</td><td>30768.16</td><td>31691.20</td><td>580398.99</td></tr><tr class="tableRow"><th class="minorHeader">Loan Proceeds</th><td>400000.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td></tr><tr class="tableRow"><th class="minorHeader">Loan Repayment</th><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>-374736.29</td></tr><tr class="tableRow"><th class="minorHeader">Amortization</th><td>0.00</td><td>-4373.10</td><td>-4689.23</td><td>-5028.21</td><td>-5391.70</td><td>-5781.47</td></tr><tr class="tableRow"><th class="minorHeader">Loan Points</th><td>-4000.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td></tr><tr class="tableRow"><th class="minorHeader">Interest</th><td>0.00</td><td>-27861.46</td><td>-27545.33</td><td>-27206.35</td><td>-26842.86</td><td>-26453.09</td></tr><tr class="tableRow"><th class="minorHeader">Interest Tax Shield</th><td>0.00</td><td>9751.51</td><td>9640.87</td><td>9522.22</td><td>9395.00</td><td>9258.58</td></tr><tr class="tableRow"><th class="minorHeader">Mortgage Insurance</th><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td></tr><tr class="tableRow"><th class="minorHeader">Levered Owner Cash Flow</th><td>-111750.00</td><td>-33681.05</td><td>-34127.63</td><td>-34592.30</td><td>-35075.92</td><td>137441.32</td></tr><tr class="tableRow"><th class="minorHeader">Levered Net Cash Flow</th><td>-111750.00</td><td>6518.95</td><td>7278.37</td><td>8055.82</td><td>8851.64</td><td>182686.72</td></tr><tr class="tableRow"><th class="minorHeader">Cum. Gross Equity</th><td>-111750.00</td><td>-145431.05</td><td>-179558.68</td><td>-214150.98</td><td>-249226.90</td><td>-111785.58</td></tr><tr class="tableRow"><th class="minorHeader">Cum. Net Equity</th><td>-111750.00</td><td>-105231.05</td><td>-97952.68</td><td>-89896.86</td><td>-81045.22</td><td>101641.50</td></tr></tbody></table>
        `]
    )
    
    /* Be sure to revisit this, I would imagine this can be condensed like formData... */
        {/*}
    const updateTable = (data) => {
        setMCFData({
        })
    }
*/}

    const [mcfData, setMCFData] = useState({
        monthlyRent: [],
        rentersInsurance: [],
        rentersCashFlow: [],
        acquisition: [],
        acquisitionCosts: [],
        sale: [],
        dispositionCosts: [],
        propertyTax: [],
        propertyTaxShield: [],
        insurance: [],
        maintenance: [],
        hoaDues: [],
        unleveredOwnCF: [],
        unleveredNetCF: [],
        loanProceeds: [],
        loanRepayment: [],
        amortization: [],
        loanPoints: [],
        interest: [],
        interestTaxShield: [],
        mortgageInsurance: [],
        leveredOwnCF: [],
        leveredNetCF: [],
        cumulativeGross: [],
        cumulativeNet: [],
    })

    const [mcfInterest, setMCFInterest] = useState(27861)
    const [mcfMortInsPay, setMCFMortInsPay] = useState(0)
    const [amortization, setAmortization] = useState(4373)

    const [initEquityNOR, setInitEquityNOR] = useState(111750)
    const [initEquityGROSS, setInitEquityGROSS] = useState(111750)
    const [maxEquityNOR, setMaxEquityNOR] = useState(111750)
    const [maxEquityGROSS, setMaxEquityGROSS] = useState(281846)
    const [profitNOR, setProfitNOR] = useState(101631)
    const [profitGROSS, setProfitGROSS] = useState(-111796)
    const [unlvIRRNOR, setUNLVIRRNOR] = useState(7.6)
    const [unlvIRRGROSS, setUNLVIRRGROSS] = useState(-0.7)
    const [lvIRRNOR, setLVIRRNOR] = useState(15.5)
    const [lvIRRGROSS, setLVIRRGROSS] = useState(-14.4)
    const [lvEMNOR, setLVEMNOR] = useState(1.91)
    const [lvEMGROSS, setLVEMGROSS] = useState(0.60)

    return (
        <div id="inputManager">
            <form onSubmit={handleSubmit}>
                <PurchaseAssumptions 
                    handleUserInput={handlePAInput}
                    purchasePrice={purchasePrice} 
                    holdingPeriod={holdingPeriod} 
                    holdingPeriodM={holdingPeriodM} 
                    component={Paper}
                />
                {/* <Divider className="divider-buffer"/> */}
                <RentAssumptions 
                    handleUserInput={handleRAInput} 
                    apartmentRent={apartmentRent} 
                    parking={parking} 
                    totalRent={totalRent} 
                    rentersInsurance={rentersInsurance} 
                />
                <div id="accordion-cont">
                    <Accordion>
                        <AccordionSummary 
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel-content"
                            id="panel-header"
                        >
                            <p className="accordionHeader">Advanced Adjustments:</p> 
                            {/* <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                Advanced Adjustments:
                            </Typography>
                            <Typography sx={{ color: 'text.secondary' }}>Fine tune default settings to your specific case.</Typography> */}
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                {/* <Typography>General Assumptions:</Typography> */}
                                <p className="accordionHeader">General Assumptions:</p>
                                <GeneralAssumptions  
                                    handleUserInput={handleGAInput}
                                    handleCheck={handleGACheck}
                                    capitalGains={capitalGains}
                                    federalTax={federalTax}
                                    federalTaxBool={federalTaxBool}
                                    saltLimit={saltLimit}
                                    saltLimitBool={saltLimitBool}
                                    rentGrowth={rentGrowth}
                                    homeAppreciation={homeAppreciation}
                                    retInflation={retInflation}
                                    otherInflation={otherInflation}
                                />

                                {/* <Typography>Acquisition Costs:</Typography> */}
                                <p className="accordionHeader">Acquisition Costs:</p>
                                <AcquisitionCosts 
                                    handleUserInput={handleACInput}
                                    inspectionFee={inspectionFee}
                                    appraisalFee={appraisalFee}
                                    legalFee={legalFee}
                                    titleInsuranceRateAq={titleInsuranceRateAq}
                                    titleInsuranceAq={titleInsuranceAq}
                                    otherLenderCosts={otherLenderCosts}
                                    transferTaxRate={transferTaxRate}
                                    transferTax={transferTax}
                                    totalAcquisition={totalAcquisition}
                                />
                                {/* <Typography>Disposition Costs:</Typography>} */}
                                <p className="accordionHeader">Disposition Costs:</p>
                                <DispositionCosts 
                                    handleUserInput={handleDCInput}
                                    titleInsuranceRateDis={titleInsuranceRateDis}
                                    titleInsuranceDis={titleInsuranceDis}
                                    transferTaxRateDis={transferTaxRateDis}
                                    transferTaxDis={transferTaxDis}
                                    brokerageRate={brokerageRate}
                                    brokerageFee={brokerageFee}
                                    totalDisposition={totalDisposition}
                                />
                                {/* <Typography>Operating Costs:</Typography> */}
                                <p className="accordionHeader">Operating Costs:</p>
                                <OperatingCosts 
                                    handleUserInput={handleOCInput}
                                    propertyTaxRate={propertyTaxRate}
                                    propertyTax={propertyTax}
                                    homeInsuranceRate={homeInsuranceRate}
                                    homeInsurance={homeInsurance}
                                    maintenanceRate={maintenanceRate}
                                    homeMaintenance={homeMaintenance}
                                    hoaUtilityRate={hoaUtilityRate}
                                    hoaUtility={hoaUtility}
                                />

                                {/* <Typography>Loan Assumptions:</Typography> */}
                                <p className="accordionHeader">Loan Assumptions:</p>
                                <LoanAssumptions 
                                    handleUserInput={handleLAInput}
                                    maxLtvLoanRate={maxLtvLoanRate}
                                    maxLtvLoan={maxLtvLoan}
                                    desiredLtvLoan={desiredLtvLoan}
                                    desiredLtvLoanRate={desiredLtvLoanRate}
                                    loanInterestRate={loanInterestRate}
                                    amortPeriod={amortPeriod}
                                    mortgageInsuranceRate={mortgageInsuranceRate}
                                    mortgageInsuranceClear={mortgageInsuranceClear}
                                    mortgagePointsRate={mortgagePointsRate}
                                    mortgagePoints={mortgagePoints}
                                />
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    <Button type="submit" variant="contained" id="submitButton" endIcon={<CalculateIcon />}>Update</Button>
                    {/*<Button onClick={getData} type="submit" variant="contained" id="submitButton" endIcon={<CalculateIcon />}>Update</Button>*/}
                </div>
            </form>
            <div className="returns_table">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Returns</TableCell>
                                <TableCell align="right">Net of Rent</TableCell>
                                <TableCell align="right">Gross</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">Initial Equity</TableCell>
                                <TableCell align="right">${initEquityNOR.toFixed(0)}</TableCell>
                                <TableCell align="right">${initEquityGROSS.toFixed(0)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Max Equity</TableCell>
                                <TableCell align="right">${maxEquityNOR.toFixed(0)}</TableCell>
                                <TableCell align="right">${maxEquityGROSS.toFixed(0)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Profit</TableCell>
                                <TableCell align="right">${profitNOR.toFixed(0)}</TableCell>
                                <TableCell align="right">${profitGROSS.toFixed(0)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Unlevered Rate of Return</TableCell>
                                <TableCell align="right">{unlvIRRNOR.toFixed(1)}%</TableCell>
                                <TableCell align="right">{unlvIRRGROSS.toFixed(1)}%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Levered Rate of Return</TableCell>
                                <TableCell align="right">{lvIRRNOR.toFixed(1)}%</TableCell>
                                <TableCell align="right">{lvIRRGROSS.toFixed(1)}%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Effective Margin</TableCell>
                                <TableCell align="right">{lvEMNOR.toFixed(2)}x</TableCell>
                                <TableCell align="right">{lvEMGROSS.toFixed(2)}x</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className="returns_table">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Owner Payments Summary</TableCell>
                                <TableCell align="right">Month</TableCell>
                                <TableCell align="right">Annual</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">Interest</TableCell>
                                <TableCell align="right">${(mcfInterest/12).toFixed(0)}</TableCell>
                                <TableCell align="right">${mcfInterest.toFixed(0)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Property Tax</TableCell>
                                <TableCell align="right">${(propertyTax/12).toFixed(0)}</TableCell>
                                <TableCell align="right">${propertyTax.toFixed(0)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Insurance</TableCell>
                                <TableCell align="right">${(homeInsurance/12).toFixed(0)}</TableCell>
                                <TableCell align="right">${homeInsurance.toFixed(0)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Maintenance</TableCell>
                                <TableCell align="right">${(homeMaintenance/12).toFixed(0)}</TableCell>
                                <TableCell align="right">${homeMaintenance.toFixed(0)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">HOA/Utilities</TableCell>
                                <TableCell align="right">${hoaUtility.toFixed(0)}</TableCell>
                                <TableCell align="right">${(hoaUtility*12).toFixed(0)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Mortgage Insurance</TableCell>
                                <TableCell align="right">${mcfMortInsPay.toFixed(0)}</TableCell>
                                <TableCell align="right">${(mcfMortInsPay*12).toFixed(0)}</TableCell>
                            </TableRow>
                            <TableRow id="subtotal_row">
                                <TableCell component="th" scope="row">Subtotal</TableCell>
                                <TableCell align="right">${((mcfInterest + propertyTax + homeInsurance + homeMaintenance)/12 + hoaUtility + mcfMortInsPay).toFixed(0)}</TableCell>
                                <TableCell align="right">${(mcfInterest + propertyTax + homeInsurance + homeMaintenance + ((hoaUtility + mcfMortInsPay)*12)).toFixed(0)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Amortization</TableCell>
                                <TableCell align="right">${(amortization/12).toFixed(0)}</TableCell>
                                <TableCell align="right">${amortization.toFixed(0)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Total</TableCell>
                                <TableCell align="right">${(((mcfInterest + propertyTax + homeInsurance + homeMaintenance)/12 + hoaUtility + mcfMortInsPay) + (amortization/12)).toFixed(0)}</TableCell>
                                <TableCell align="right">${((mcfInterest + propertyTax + homeInsurance + homeMaintenance + ((hoaUtility + mcfMortInsPay)*12)) + amortization).toFixed(0)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Minimum</TableCell>
                                <TableCell align="right">${((mcfInterest + propertyTax + homeInsurance + amortization)/12 + mcfMortInsPay).toFixed(0)}</TableCell>
                                <TableCell align="right">${(mcfInterest + propertyTax + homeInsurance + amortization + (mcfMortInsPay*12)).toFixed(0)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Apartment Rent</TableCell>
                                <TableCell align="right">${(totalRent + (rentersInsurance/12)).toFixed(0)}</TableCell>
                                <TableCell align="right">${((totalRent*12) + rentersInsurance).toFixed(0)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div className="cfTable">
                <TableContainer component={Paper}>
                    <h4>Annual Cash Flow</h4>
                    <div className="ACF_Table" dangerouslySetInnerHTML={{__html: acfTable}}/>
                </TableContainer>
            </div>
            <div className="cfTable">
                <TableContainer component={Paper}>
                    <h4>Monthly Cash Flow:</h4>
                    <div className="MCF_Table" dangerouslySetInnerHTML={{__html: mcfTable}}/>
                </TableContainer>
            </div>
        </div>
    )
}

export default InputManager;