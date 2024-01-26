import React, { useState, useEffect, Component } from "react";
import PurchaseAssumptions from "./PurchaseAssumptions";
import RentAssumptions from "./RentAssumptions";
import GeneralAssumptions from "./GeneralAssumptions";
import AcquisitionCosts from "./AcquisitionCosts";
import DispositionCosts from "./DispositionCosts";
import OperatingCosts from "./OperatingCosts";
import LoanAssumptions from "./LoanAssumptions";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalculateIcon from '@mui/icons-material/Calculate';
//import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
//import axios from "axios";
import { Cookies } from "react-cookie";
//import { Cookies } from "react-cookie";

import { useRouter, useNavigate } from "react-router-dom"
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
//import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from '@material-ui/core/FormControl';
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const InputManager = (props) => {
        /* State Manager for JSON Form Data */
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

        /*
        useEffect(() => {
            alert("Refresh Detected!")
            if (props.user.id) {
                axios
                    .get(`/api/dataFields/${props.user_id}`)
                    .then((response) => {
                        const inputs = response.data;
                        this.setFormData(inputs);
                    });
                    //.catch(error => console.log(error));
            };
        });

        
        const handleLoad = (e) => {
            e.preventDefault();
            alert("Refresh Detected!")
            if (e.user.id) {
                axios
                    .get(`/api/dataFields/${e.user_id}`)
                    .then((response) => {
                        const inputs = response.data;
                        this.setFormData(inputs);
                    });
                    //.catch(error => console.log(error));
            };
        }
        */
        
        const handleSubmit = (e) => {
            e.preventDefault();
            //const jsonFormData = JSON.stringify(formData);
            //alert(jsonFormData);
            if (e.user_id) {
                axios
                    .put(`/api/dataFields/${e.user_id}`, formData);
                return;
            } else {
                axios
                    .post("/api/dataFields/", formData);
            }
        };
        

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

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <PurchaseAssumptions 
                    handleUserInput={handlePAInput}
                    purchasePrice={purchasePrice} 
                    holdingPeriod={holdingPeriod} 
                    holdingPeriodM={holdingPeriodM} 
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
                                <Accordion>
                                    <AccordionSummary 
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        {/* <Typography>General Assumptions:</Typography> */}
                                        <p className="accordionHeader">General Assumptions:</p>
                                    </AccordionSummary>
                                    <AccordionDetails>
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
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary 
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel2a-content"
                                        id="panel2a-header"
                                    >
                                        {/* <Typography>Acquisition Costs:</Typography> */}
                                        <p className="accordionHeader">Acquisition Costs:</p>
                                    </AccordionSummary>
                                    <AccordionDetails>
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
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary 
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3a-content"
                                        id="panel3a-header"
                                    >
                                        {/* <Typography>Disposition Costs:</Typography>} */}
                                        <p className="accordionHeader">Disposition Costs:</p>
                                    </AccordionSummary>
                                    <AccordionDetails>
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
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary 
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel4a-content"
                                        id="panel4a-header"
                                    >
                                        {/* <Typography>Operating Costs:</Typography> */}
                                        <p className="accordionHeader">Operating Costs:</p>
                                    </AccordionSummary>
                                    <AccordionDetails>
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
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary 
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel5a-content"
                                        id="panel5a-header"
                                    >
                                        {/* <Typography>Loan Assumptions:</Typography> */}
                                        <p className="accordionHeader">Loan Assumptions:</p>
                                    </AccordionSummary>
                                    <AccordionDetails>
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
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    <Button type="submit" variant="contained" id="submitButton" endIcon={<CalculateIcon />}>Submit</Button>
                </div>
            </form>
        </div>
    )
};

export default InputManager;

/*
<form onSubmit={handleSubmit}>
            <PurchaseAssumptions 
                handleUserInput={handlePAInput}
                purchasePrice={purchasePrice} 
                holdingPeriod={holdingPeriod} 
                holdingPeriodM={holdingPeriodM} 
            />
            {/* <Divider className="divider-buffer"/>
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
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        {/* <Typography>General Assumptions:</Typography> 
                        <p className="accordionHeader">General Assumptions:</p>
                    </AccordionSummary>
                    <AccordionDetails>
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
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary 
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        {/* <Typography>Acquisition Costs:</Typography>
                        <p className="accordionHeader">Acquisition Costs:</p>
                    </AccordionSummary>
                    <AccordionDetails>
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
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary 
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3a-content"
                        id="panel3a-header"
                    >
                        {/* <Typography>Disposition Costs:</Typography>}
                        <p className="accordionHeader">Disposition Costs:</p>
                    </AccordionSummary>
                    <AccordionDetails>
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
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary 
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4a-content"
                        id="panel4a-header"
                    >
                        {/* <Typography>Operating Costs:</Typography>
                        <p className="accordionHeader">Operating Costs:</p>
                    </AccordionSummary>
                    <AccordionDetails>
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
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary 
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel5a-content"
                        id="panel5a-header"
                    >
                        {/* <Typography>Loan Assumptions:</Typography>
                        <p className="accordionHeader">Loan Assumptions:</p>
                    </AccordionSummary>
                    <AccordionDetails>
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
                    </AccordionDetails>
                </Accordion>
                <Button type="submit" variant="outlined" id="submitButton">Submit</Button>
            </div>
        </form>
        */
