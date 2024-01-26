import React /*, { useState } */ from "react";
import Grid from '@mui/material/Unstable_Grid2';
import { TextField } from "@mui/material";
import { InputAdornment } from "@mui/material";

const RentAssumptions = (props) => {
    /* Vestigial State Manager from Child...
    const [apartmentRent, setApartmentRent] = useState(3000);
    const [parking, setParking] = useState(300);
    const [totalRent, setTotalRent] = useState(3300);
    const [rentersInsurance, setRentersInsurance] = useState(600);

    const handleUserInput = (e) => {
        switch(e.target.id) {
            case 'apartmentRent': 
                setApartmentRent(Number(e.target.value));
                setTotalRent(parking + apartmentRent);
                break;
            case 'parking':
                setParking(Number(e.target.value));
                setTotalRent(parking + apartmentRent);
                break;
            case 'rentersInsurance':
                setRentersInsurance(Number(e.target.value));
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
            <p className="inputHeader">Rent Assumptions:</p>
            <Grid container spacing={2}>
                <Grid xs={4}>
                    <TextField 
                        id="apartment_rent" 
                        label="Apartment Rent" 
                        variant="outlined" 
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth

                        value={props.apartmentRent}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="parking_rent" 
                        label="Parking" 
                        variant="outlined"  
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth

                        value={props.parking}
                        onChange={handleUserInput}
                    />
                </Grid>
                <Grid xs={2}>
                    <TextField 
                        id="monthly_rent" 
                        label="Total Rent" 
                        variant="outlined"  
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        fullWidth
                        disabled

                        value={props.totalRent}
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField 
                        id="renters_insurance" 
                        label="Renter's Insurance" 
                        variant="outlined"  
                        InputProps={{ endAdornment: <InputAdornment position="end">/year</InputAdornment> }}
                        fullWidth

                        value={props.rentersInsurance}
                        onChange={handleUserInput}
                    />
                </Grid>
            </Grid>
        </div>
    )
};

export default RentAssumptions;