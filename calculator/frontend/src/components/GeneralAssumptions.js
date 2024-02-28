import React /*, { useState } */ from "react";
import Grid from '@mui/material/Unstable_Grid2';
import { TextField } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { Checkbox } from "@mui/material";

const GeneralAssumptions = (props) => {
    
    /* Vestigial State Manager For Child...
    const [capitalGains, setCapitalGains] = useState(20);
    const [federalTax, setFederalTax] = useState(35);
    const [federalTaxBool, setFederalTaxBool] = useState(true);
    const [saltLimit, setSaltLimit] = useState(10000);
    const [saltLimitBool, setSaltLimitBool] = useState(true);
    const [rentGrowth, setRentGrowth] = useState(3);
    const [homeAppreciation, setHomeAppreciation] = useState(3);
    const [retInflation, setRetInflation] = useState(3);
    const [otherInflation, setOtherInflation] = useState(3);

    const handleUserInput = (event) => {
        switch(event.target.id) {
            case 'capitalGains': 
                setCapitalGains(Number(event.target.value));
                break;
            case 'federalTax':
                setFederalTax(Number(event.target.value));
                break;
            case 'saltLimit':
                setSaltLimit(Number(event.target.value));
                break;
            case 'rentGrowth':
                setRentGrowth(Number(event.target.value));
                break;
            case 'homeAppreciation':
                setHomeAppreciation(Number(event.target.value));
                break;
            case 'retInflation':
                setRetInflation(Number(event.target.value));
                break;
            case 'otherInflation':
                setOtherInflation(Number(event.target.value));
                break;
            default:
                break;
        }
    }; 

    const handleCheck = (event) => {
        switch (event.target.id) {
            case 'federalTaxBool':
                setFederalTaxBool(event.target.checked);
                if (federalTaxBool) {
                    setFederalTax(0);
                } else {
                    setFederalTax(35);
                }
                break;
            case 'saltLimitBool':
                setSaltLimitBool(event.target.checked);
                if (saltLimitBool) {
                    setSaltLimit(0);
                } else {
                    setSaltLimit(10000);
                }
                break;
            default:
                break;
        }
    }; */

    const handleUserInput = (e) => {
        props.handleUserInput(e);
    };

    const handleCheck = (e) => {
        props.handleCheck(e);
    };

    return (
        <div className="innerAccord-cont">
            {/* <p className="inputHeader">General Assumptions:</p> */}
            <Grid container spacing={2}>
                <Grid xs={2.5}>
                    <TextField 
                        id="rate_capital_gains" 
                        label="Capital Gains Rate" 
                        variant="outlined" 
                        fullWidth

                        value={props.capitalGains}
                        onChange={handleUserInput}
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="rate_federal_tax" 
                        label="Federal Tax" 
                        variant="outlined"  
                        fullWidth

                        value={props.federalTax}
                        onChange={handleUserInput}
                        InputProps={{ 
                            startAdornment: <InputAdornment position="start">
                                <Checkbox
                                    id="bool_federal"
                                    checked={props.federalTaxBool}
                                    onChange={handleCheck}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                                </InputAdornment>,
                            endAdornment: <InputAdornment position="end">%</InputAdornment> 
                        }}
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="salt_limit" 
                        label="SALT Limit" 
                        variant="outlined"  
                        fullWidth

                        value={props.saltLimit}
                        onChange={handleUserInput}
                        InputProps={{ 
                            startAdornment: <InputAdornment position="start">
                                <Checkbox
                                    id="bool_salt"
                                    checked={props.saltLimitBool}
                                    onChange={handleCheck}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />$
                                </InputAdornment>,
                        }}
                    />
                </Grid>
                <Grid xs={2}>
                    <TextField 
                        id="rent_growth" 
                        label="Rent Growth" 
                        variant="outlined" 
                        fullWidth

                        value={props.rentGrowth}
                        onChange={handleUserInput}
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    />
                </Grid>
                <Grid xs={2}>
                    <TextField 
                        id="home_appreciation" 
                        label="Home Appreciation" 
                        variant="outlined" 
                        fullWidth

                        value={props.homeAppreciation}
                        onChange={handleUserInput}
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    />
                </Grid>
                <Grid xs={2}>
                    <TextField 
                        id="ret_inflation" 
                        label="RET Inflation" 
                        variant="outlined" 
                        fullWidth

                        value={props.retInflation}
                        onChange={handleUserInput}
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    />
                </Grid>
                <Grid xs={2}>
                    <TextField 
                        id="other_inflation" 
                        label="Other Inflation" 
                        variant="outlined" 
                        fullWidth

                        value={props.otherInflation}
                        onChange={handleUserInput}
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    />
                </Grid>
            </Grid>
        </div>
    )
};

export default GeneralAssumptions;