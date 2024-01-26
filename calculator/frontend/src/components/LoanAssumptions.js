import React /*, { useState }*/ from "react";
import Grid from '@mui/material/Unstable_Grid2';
import { TextField } from "@mui/material";
/*import { Unstable_NumberInput as NumberInput } from "@mui/base/Unstable_NumberInput";*/
import { InputAdornment } from "@mui/material";
//import { purchasePrice } from "./PurchaseAssumptions";

const LoanAssumptions = (props) => {

    const handleUserInput = (e) => {
        props.handleUserInput(e);
    };

    return (
        <div className="inputFields" >
            {/* <p className="inputHeader">Loan Assumptions:</p> */}
            <Grid container spacing={2}>
                <Grid xs={3}>
                    <TextField 
                        id="loan_ltv_max" 
                        label="Max Loan LTV" 
                        variant="outlined"
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth

                        value={props.maxLtvLoan}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="rate_ltv_max" 
                        label="Max Loan LTV Rate" 
                        variant="outlined"
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        fullWidth

                        value={props.maxLtvLoanRate}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="loan_ltv_desired" 
                        label="Desired Loan LTV" 
                        variant="outlined"  
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth
                        disabled

                        value={props.desiredLtvLoan}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="rate_ltv_desired" 
                        label="Desired Loan LTV Rate" 
                        variant="outlined"
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        fullWidth
                        disabled

                        value={props.desiredLtvLoanRate}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={2}>
                    <TextField 
                        id="rate_home_loan" 
                        label="Loan Interest Rate" 
                        variant="outlined"
                        inputProps = {{ step: 0.1 }}
                        InputProps={{ 
                            endAdornment: <InputAdornment position="end">%</InputAdornment>
                        }}
                        fullWidth

                        value={props.loanInterestRate}
                        onChange={handleUserInput}
                        type="number"
                    />
                </Grid>
                {/*
                <Grid xs={3}>
                    <TextField 
                        id="rate_home_loan" 
                        label="Loan Interest Rate" 
                        variant="outlined"
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        fullWidth

                        value={props.loanInterestRate}
                        onChange={handleUserInput}
                    />
                </Grid>
                */}
                <Grid xs={3}>
                    <TextField 
                        id="amort_home_loan" 
                        label="Loan Amortization" 
                        variant="outlined"
                        InputProps={{ endAdornment: <InputAdornment position="end">years</InputAdornment> }}
                        fullWidth

                        value={props.amortPeriod}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={2}>
                    <TextField 
                        id="rate_mortgage_insurance" 
                        label="Mortgage Insurance Rate" 
                        variant="outlined"
                        inputProps = {{ step: 0.1 }}
                        InputProps={{ 
                            endAdornment: <InputAdornment position="end">%</InputAdornment>
                        }}
                        fullWidth

                        value={props.mortgageInsuranceRate}
                        onChange={handleUserInput}
                        type="number"
                    />
                </Grid>
                {/*
                <Grid xs={3}>
                    <TextField 
                        id="rate_mortgage_insurance" 
                        label="Mortgage Insurance Rate" 
                        variant="outlined"
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        fullWidth

                        value={props.mortgageInsuranceRate}
                        onChange={handleUserInput}
                    />
                </Grid>
                */}
                <Grid xs={3}>
                    <TextField 
                        id="clear_mortgage_insurance" 
                        label="Mortgage Insurance Threshold" 
                        variant="outlined"
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        fullWidth

                        value={props.mortgageInsuranceClear}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={2}>
                    <TextField 
                        id="rate_mortgage_points" 
                        label="Mortgage Points Rate" 
                        variant="outlined"
                        inputProps = {{ step: 0.1 }}
                        InputProps={{ 
                            endAdornment: <InputAdornment position="end">%</InputAdornment>
                        }}
                        fullWidth

                        value={props.mortgagePointsRate}
                        onChange={handleUserInput}
                        type="number"
                    />
                </Grid>
                {/*
                <Grid xs={3}>
                    <TextField 
                        id="rate_mortgage_points" 
                        label="Mortgage Points Rate" 
                        variant="outlined"
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        fullWidth

                        value={props.mortgagePointsRate}
                        onChange={handleUserInput}
                    />
                </Grid>
                */}
                <Grid xs={3}>
                    <TextField 
                        id="mortgage_points" 
                        label="Mortgage Points" 
                        variant="outlined"
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth

                        value={props.mortgagePoints}
                        onChange={handleUserInput}
                    />
                </Grid>
            </Grid>
        </div>
    )
};

export default LoanAssumptions;