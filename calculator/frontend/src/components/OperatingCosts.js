import React /*, { useState }*/ from "react";
import Grid from '@mui/material/Unstable_Grid2';
import { TextField } from "@mui/material";
/*import { Unstable_NumberInput as NumberInput } from "@mui/base/Unstable_NumberInput";*/
import { InputAdornment } from "@mui/material";
//import { purchasePrice } from "./PurchaseAssumptions";

const OperatingCosts = (props) => {

    const handleUserInput = (e) => {
        props.handleUserInput(e);
    };

    return (
        <div className="innerAccord-cont">
            {/* <p className="inputHeader">Operating Costs:</p> */}
            <Grid container spacing={2}>
                <Grid xs={3}>
                    <TextField 
                        id="rate_property_tax" 
                        label="Property Tax Rate" 
                        variant="outlined"
                        inputProps = {{ step: 0.1 }}
                        InputProps={{ 
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            step: 0.1, 
                        }}
                        fullWidth

                        value={props.propertyTaxRate}
                        onChange={handleUserInput}
                        type="number"
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="property_tax" 
                        label="Property Tax" 
                        variant="outlined"
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth

                        value={props.propertyTax}
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
                        id="rate_home_insurance" 
                        label="Home Insurance Rate" 
                        variant="outlined"
                        inputProps = {{ step: 0.1 }} 
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        fullWidth

                        value={props.homeInsuranceRate}
                        onChange={handleUserInput}
                        type="number"
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="home_insurance" 
                        label="Home Insurance" 
                        variant="outlined"  
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth

                        value={props.homeInsurance}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="rate_home_maintenance" 
                        label="Home Maintenance Rate" 
                        variant="outlined"
                        inputProps = {{ step: 0.1 }}
                        InputProps={{ 
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            step: 0.1, 
                        }}
                        fullWidth

                        value={props.maintenanceRate}
                        onChange={handleUserInput}
                        type="number"
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="home_maintenance" 
                        label="Home Maintenance" 
                        variant="outlined"
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth

                        value={props.homeMaintenance}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="rate_hoa_util" 
                        label="HOA Utility Rate" 
                        variant="outlined"
                        inputProps = {{ step: 0.05 }}
                        InputProps={{ 
                            endAdornment: <InputAdornment position="end">%</InputAdornment>
                        }}
                        fullWidth

                        value={props.hoaUtilityRate}
                        onChange={handleUserInput}
                        type="number"
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="hoa_util" 
                        label="HOA Utility Fees" 
                        variant="outlined"
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth

                        value={props.hoaUtility}
                        onChange={handleUserInput}
                    />
                </Grid>
            </Grid>
        </div>
    )
};

export default OperatingCosts;