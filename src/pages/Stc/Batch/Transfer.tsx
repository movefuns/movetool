import {Card, CardContent, Grid, TextField} from "@mui/material";
import * as React from 'react';
import BatchTransfer from "./BatchTransfer"


export default function Transfer() {
    const [input, setInput] = React.useState("")

    // filter address
    const addressArray = input.split("\n").map(v => {
        const items = v.split(/\s*,\s*|\s+/)
        return {
            address: items[0],
            stc: items[1] ? items[1] : "0"
        }
    }).filter(v => v && v.address && v.address.startsWith("0x"))


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
            <BatchTransfer addressArray={addressArray}/>
        </Grid>
    </Grid></>
}