import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const Instructional = () => {
    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Item>xs=4</Item>
                    </Grid>
                    <Grid item xs={8}>
                        <Item>
                            <Typography variant="h5" gutterBottom>
                                Quick Guide:
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Step 1: 
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Populate all applicable fields before submitting the information for processing. Upon doing so,
                                a series of tables/figures will be generated. Tables include monthly and annual cash flows, as 
                                predicted by your specific inputs. Additional summarized metrics are included for rapid analysis.
                            </Typography>
                        </Item>
                    </Grid>
                    <Grid item xs={8}>
                        <Item>
                            <Typography variant="h6" gutterBottom>
                                Step 2: 
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Populate all applicable fields before submitting the information for processing. Upon doing so,
                                a series of tables/figures will be generated. Tables include monthly and annual cash flows, as 
                                predicted by your specific inputs. Additional summarized metrics are included for rapid analysis.
                            </Typography>
                        </Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>xs=4</Item>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default Instructional;