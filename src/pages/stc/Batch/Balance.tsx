import {Card, CardContent, Grid, TextField} from "@mui/material";
import * as React from 'react';
import BatchBalance from "./BatchBalance";

export default function Balance() {

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
                0x0000000000000000001<br/>
                0x0000000000000000002<br/>
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
            <BatchBalance addressArray={addressArray}/>
        </Grid>
    </Grid></>
}