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
    const [input, setInput] = React.useState("")

    // filter address
    const addressArray = input.split("\n").map(v => {
        const items = v.split(/\s*,\s*|\s+/)
        return {
            address: items[0],
            stc: items[1] ? items[1] : "0"
        }
    }).filter(v => v && v.address && v.address.startsWith("0x"))


    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };


    return <><Grid container spacing={2}>
        <Grid item xs={6} md={4}>
            <Card sx={{minWidth: 275}}>
                example:<br/>
                0x0000000000000000001 2<br/>
                0x0000000000000000001,2<br/>
                <CardContent>
                    <TextField
                        id="filled-multiline-static"
                        label="address"
                        multiline
                        rows={40}
                        fullWidth
                        onChange={(value) => setInput(value.target.value)}
                        variant="filled"

                    />
                </CardContent>
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
                        <BatchBalance addressArray={addressArray}/>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography>批量转账</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <BatchTransfer addressArray={addressArray}/>
                    </AccordionDetails>
                </Accordion>

            </div>
        </Grid>
    </Grid></>
}