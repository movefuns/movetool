import {Button, Card, CardActions, CardContent, Grid, TextField, Typography} from "@mui/material";
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BatchBalance from "./BatchBalance";
import BatchTransfer from "./BatchTransfer"


export default function Batch() {

    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };


    return <><Grid container spacing={2}>
        <Grid item xs={6} md={4}>
            <Card sx={{minWidth: 275}}>
                <CardContent>
                    <TextField
                        id="filled-multiline-static"
                        label="address"
                        multiline
                        rows={40}
                        fullWidth
                        variant="filled"
                    />
                </CardContent>
                <CardActions>
                    <Button size="small">Learn More</Button>
                </CardActions>
            </Card>
        </Grid>


        <Grid item xs={6} md={8}>
            <div>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>余额查询</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <BatchBalance></BatchBalance>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >

                    </AccordionSummary>
                    <AccordionDetails>
                        <BatchTransfer></BatchTransfer>
                    </AccordionDetails>
                </Accordion>

            </div>
        </Grid>
    </Grid></>
}