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

const Introduction = () => {
    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Item>
                            <Typography variant="h5" gutterBottom>
                                Welcome to the Rent to Own Calculator!
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Let's face it, we all want to live out the dream of being a home owner. You may be wondering 
                                if now is the right time to buy. However depending on a whole host of factors, it may be more 
                                fiscally responsible to continue renting. Our reasoning for home ownership goes far beyond 
                                potential monetary gain, but it should certainly be a factor into finding the 'dream' home.

                                This tool is meant for the recreational analysis and exploration of investing in real estate. 
                                Whether you are making the decision to purchase your first home, or looking for a investment 
                                property this tool will provide you with tools to make an informed decision.

                                To get started, all you need is your current/forecasted rent costs and your anticipated home
                                purchase price. We have gone ahead and made some assumptions on your behalf, but feel free to 
                                play around and see how your decisions will play out in the coming years.
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Advanced Adjustments: 
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                If this is your first experience with real estate, you may want to stick to our basic tools. If
                                you are a seasoned pro, expand the 'Advanced Adjustments' tab to gain access to our assumed 
                                factors. Doing so will allow for fine-tuned analysis, targeting potential returns on investment,
                                various loan types, and ownership scenarios to match your specific case.
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

export default Introduction;