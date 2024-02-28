import React /*, { useState } */ from "react";
import Grid from '@mui/material/Unstable_Grid2';
import { TextField } from "@mui/material";
import { InputAdornment } from "@mui/material";

const PurchaseAssumptions = (props) => {
    
    /* Vestigial State Manager Within Child...
    const [purchasePrice, setPurchasePrice] = useState(500000);
    const [holdingPeriod, setHoldingPeriod] = useState(5);
    const [holdingPeriodM, setHoldingPeriodM] = useState(60);
    
    const handleInput = (e) => {
        if (e.target.id === 'purchasePrice') {
            setPurchasePrice(Number(e.target.value));
        } else if (e.target.id === 'hold_period') {
            setHoldingPeriod(Number(e.target.value));
            setHoldingPeriodM(Number(e.target.value) * 12)
        }
    } */

    const handleUserInput = (e) => {
        props.handleUserInput(e);
        //props.handleChange(e);
    };

    return (
        <div className="inputFields" >
            <h4 className="inputHeader">Purchase Assumptions</h4>
            <div className="inputDiv">
                <Grid container spacing={2}>
                    <Grid xs={6}>
                        <TextField 
                            id="purchase_price"  
                            label="Purchase Price"
                            variant="outlined" 
                            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                            fullWidth

                            value={props.purchasePrice}
                            onChange={handleUserInput}
                        />
                    </Grid>
                    <Grid xs={4}>
                        <TextField 
                            id="hold_period" 
                            label="Hold Period" 
                            variant="outlined"  
                            InputProps={{ endAdornment: <InputAdornment position="end">years</InputAdornment> }}
                            fullWidth

                            value={props.holdingPeriod}
                            onChange={handleUserInput}
                        />
                    </Grid>
                    <Grid xs={2}>
                        <TextField 
                            id="hold_period_m" 
                            label="Hold Period" 
                            variant="outlined"  
                            InputProps={{ endAdornment: <InputAdornment position="end">months</InputAdornment> }}
                            fullWidth
                            disabled

                            value={props.holdingPeriodM}
                        />
                    </Grid>
                </Grid>
            </div>
        </div>
    )
};

export default PurchaseAssumptions;