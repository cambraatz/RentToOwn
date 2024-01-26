import React /*, { useState }*/ from "react";
import Grid from '@mui/material/Unstable_Grid2';
import { TextField } from "@mui/material";
//import { Unstable_NumberInput as NumberInput } from "@mui/base/Unstable_NumberInput";
import { InputAdornment } from "@mui/material";
//import { purchasePrice } from "./PurchaseAssumptions";

const DispositionCosts = (props) => {

    const handleUserInput = (e) => {
        props.handleUserInput(e);
    };

    return (
        <div className="inputFields" >
            {/* <p className="inputHeader">Disposition Costs:</p> */}
            <Grid container spacing={2}>
                <Grid xs={3}>
                    <TextField 
                        id="rate_title_insurance_dis" 
                        label="Title Insurance Rate" 
                        variant="outlined"
                        inputProps = {{ step: 0.1 }}
                        InputProps={{ 
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            step: 0.1, 
                        }}
                        fullWidth

                        value={props.titleInsuranceRateDis}
                        onChange={handleUserInput}
                        type="number"
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="title_insurance_dis" 
                        label="Title Insurance" 
                        variant="outlined"
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth

                        value={props.titleInsuranceDis}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="rate_transfer_tax_dis" 
                        label="Transfer Tax Rate" 
                        variant="outlined"
                        inputProps = {{ step: 0.1 }}
                        InputProps={{ 
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            step: 0.1, 
                        }}
                        fullWidth

                        value={props.transferTaxRateDis}
                        onChange={handleUserInput}
                        type="number"
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="transfer_tax_dis" 
                        label="Transfer Tax" 
                        variant="outlined"  
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth

                        value={props.transferTaxDis}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={3}>
                    {/*<NumberInput 
                        id="brokerageRate" 
                        label="Brokerage Rate" 
                        endAdornment= {<InputAdornment position="end">%</InputAdornment>}

                        value={props.brokerageRate}
                        onChange={handleUserInput}
                    />*/}
                    <TextField 
                        id="rate_brokerage" 
                        label="Brokerage Rate" 
                        variant="outlined"
                        inputProps = {{ step: 0.1 }} 
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        fullWidth

                        value={props.brokerageRate}
                        onChange={handleUserInput}
                        type="number"
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="fee_brokerage" 
                        label="Brokerage Fee" 
                        variant="outlined"  
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth

                        value={props.brokerageFee}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={2}>
                    <TextField 
                        id="total_disposition" 
                        label="Total Disposition Costs" 
                        variant="outlined"  
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth
                        disabled

                        value={props.totalDisposition}
                    />
                </Grid>
            </Grid>
        </div>
    )
};

export default DispositionCosts;