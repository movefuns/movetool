import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
    Stack,
    TextField,
} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

import {reset, extract, restore} from "../../../games/free_bank/change_auth";

export default function ChangeAuth() {
    const [authKey, setAuthKey] = useState("")
    return <>
        <Card>
            <CardContent>
                <Stack spacing={2}>

                    <TextField
                        fullWidth
                        aria-readonly
                        id="outlined-multiline-static"
                        label="Auth Key"
                        value={authKey}
                        onChange={(v) => {
                            setAuthKey(v.target.value)
                        }}
                        multiline
                        rows={1}/>
                </Stack>

            </CardContent>

            <CardActions>

                <Button variant="contained" fullWidth
                      onClick={async () => {
                    await reset(authKey)
                }}>reset</Button>
                <Button variant="contained" fullWidth onClick={async () => {
                    await restore()
                }}>restore</Button>
                <Button variant="contained" fullWidth onClick={async () => {
                    await extract()
                }}>extract</Button>
            </CardActions>
        </Card>
    </>
}