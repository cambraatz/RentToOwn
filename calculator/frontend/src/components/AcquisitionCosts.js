import React /*, { useState } */ from "react";
import Grid from '@mui/material/Unstable_Grid2';
import { TextField } from "@mui/material";
import { InputAdornment } from "@mui/material";
//import { purchasePrice } from "./PurchaseAssumptions";

const AcquisitionCosts = (props) => {
    /* Vestigial State Manager from Child...
    const [inspectionFee, setInspectionFee] = useState(1000);
    const [appraisalFee, setAppraisalFee] = useState(750);
    const [legalFee, setLegalFee] = useState(1500);
    const [titleInsuranceRateAq, setTitleInsuranceRateAq] = useState(0.5);
    const [titleInsuranceAq, setTitleInsuranceAq] = useState(2500);
    const [otherLenderCosts, setOtherLenderCosts] = useState(2000);
    const [transferTaxRate, setTransferTaxRate] = useState(0);
    const [transferTax, setTransferTax] = useState(0);
    const [totalAcquisition, setTotalAcquisition] = useState(7750);

    //let purchasePrice = 500000;

    const handleUserInput = (e) => {
        switch(e.target.id) {
            case 'inspectionFee': 
                setInspectionFee(Number(e.target.value));
                setTotalAcquisition(Number(e.target.value) + appraisalFee + legalFee + titleInsuranceAq + otherLenderCosts + transferTax);
                break;
            case 'appraisalFee':
                setAppraisalFee(Number(e.target.value));
                setTotalAcquisition(Number(e.target.value) + inspectionFee + legalFee + titleInsuranceAq + otherLenderCosts + transferTax);
                break;
            case 'legalFee':
                setLegalFee(Number(e.target.value));
                setTotalAcquisition(Number(e.target.value) + inspectionFee + appraisalFee + titleInsuranceAq + otherLenderCosts + transferTax);
                break;
            case 'titleInsuranceRateAq':
                setTitleInsuranceRateAq(Number(e.target.value));
                setTitleInsuranceAq(Number(e.target.value) * purchasePrice);
                setTotalAcquisition((Number(e.target.value) * purchasePrice) + inspectionFee + appraisalFee + legalFee + otherLenderCosts + transferTax);
                break;
            case 'titleInsuranceAq':
                setTitleInsuranceAq(Number(e.target.value));
                setTitleInsuranceRateAq((Number(e.target.value) / purchasePrice) * 100);
                setTotalAcquisition(Number(e.target.value) + inspectionFee + appraisalFee + legalFee + otherLenderCosts + transferTax);
                break;
            case 'otherLenderCosts':
                setOtherLenderCosts(Number(e.target.value));
                setTotalAcquisition(Number(e.target.value) + inspectionFee + appraisalFee + legalFee + titleInsuranceAq + transferTax);
                break;
            case 'transferTaxRate':
                setTransferTaxRate(Number(e.target.value));
                setTransferTax(Number(e.target.value) * purchasePrice);
                setTotalAcquisition((Number(e.target.value) * props.purchasePrice) + inspectionFee + appraisalFee + legalFee + titleInsuranceAq + otherLenderCosts);
                break;
            case 'transferTax':
                setTransferTax(Number(e.target.value));
                setTransferTaxRate((Number(e.target.value) / purchasePrice) * 100);
                setTotalAcquisition(Number(e.target.value) + inspectionFee + appraisalFee + legalFee + titleInsuranceAq + otherLenderCosts);
                break;
            default:
                break;
        }
    } */

    const handleUserInput = (e) => {
        props.handleUserInput(e);
    };

    return (
        <div className="inputFields" >
            {/* <p className="inputHeader">Acquisition Costs:</p> */}
            <Grid container spacing={2}>
                <Grid xs={3}>
                    <TextField 
                        id="fee_inspection" 
                        label="Inspection Fee" 
                        variant="outlined" 
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth

                        value={props.inspectionFee}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="fee_appraisal" 
                        label="Appraisal Fee" 
                        variant="outlined"  
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth

                        value={props.appraisalFee}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="fee_legal" 
                        label="Legal Fee" 
                        variant="outlined"  
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth

                        value={props.legalFee}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={3}></Grid>
                <Grid xs={2}>
                    <TextField 
                        id="rate_title_insurance_aq" 
                        label="Title Insurance Rate" 
                        variant="outlined"
                        inputProps = {{ step: 0.1 }}
                        InputProps={{ 
                            endAdornment: <InputAdornment position="end">%</InputAdornment>
                        }}
                        fullWidth

                        value={props.titleInsuranceRateAq}
                        onChange={handleUserInput}
                        type="number"
                    />
                </Grid>
                {/*
                <Grid xs={2}>
                    <TextField 
                        id="rate_title_insurance_aq" 
                        label="Title Insurance Rate" 
                        variant="outlined"  
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        fullWidth

                        value={props.titleInsuranceRateAq}
                        onChange={handleUserInput}
                    />
                </Grid>
                */}
                <Grid xs={3}>
                    <TextField 
                        id="title_insurance_aq" 
                        label="Title Insurance" 
                        variant="outlined"  
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth

                        value={props.titleInsuranceAq}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={2}>
                    <TextField 
                        id="rate_transfer_tax_aq" 
                        label="Transfer Tax Rate" 
                        variant="outlined"
                        inputProps = {{ step: 0.1 }}
                        InputProps={{ 
                            endAdornment: <InputAdornment position="end">%</InputAdornment>
                        }}
                        fullWidth

                        value={props.transferTaxRate}
                        onChange={handleUserInput}
                        type="number"
                    />
                </Grid>
                {/*
                <Grid xs={2}>
                    <TextField 
                        id="rate_transfer_tax_aq" 
                        label="Transfer Tax Rate" 
                        variant="outlined"  
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        fullWidth

                        value={props.transferTaxRate}
                        onChange={handleUserInput}
                    />
                </Grid>
                */}
                <Grid xs={3}>
                    <TextField 
                        id="transfer_tax_aq" 
                        label="Transfer Tax" 
                        variant="outlined"  
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth

                        value={props.transferTax}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="lender_costs_other" 
                        label="Other Lender Costs" 
                        variant="outlined"  
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth

                        value={props.otherLenderCosts}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="total_acquisition" 
                        label="Total Acquisition Costs" 
                        variant="outlined"  
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth
                        disabled

                        value={props.totalAcquisition}
                    />
                </Grid>
            </Grid>
        </div>
    )
};

export default AcquisitionCosts;