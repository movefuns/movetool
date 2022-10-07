import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
    Backdrop,
    CircularProgress,
    Stack,
    TextField,
} from "@mui/material";

import {useTranslation} from "react-i18next";
import {useState} from "react";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

export default function MoveU8toString() {
    const {t} = useTranslation();
    const regex = new RegExp(/\[(\d+(,\s)?)*\]/g);

    const [loading, setLoading] = React.useState(false);
    const buttonstr = t("aptos.resolve");
    const [convertButton, setconvertButton] = React.useState(buttonstr);
    const [input, setInput] = useState("");

    const handleCheck = async () => {
        try {
            setLoading(true);
            const buttonstr = t("aptos.resolve");
            setconvertButton(buttonstr);
            let str = input;
            if (regex.test(str)) {
                if(regex!=null){
                    const matcheds = str.match(regex)
                    matcheds?.forEach((matched:any) =>{
                        const arr = JSON.parse(matched);
                        const parsed = arr.map((c:any) => String.fromCharCode(c)).join("");
                        str = str.replace(matched, parsed);
                    })
                    setInput(str);
                    const buttonstr = t("aptos.resolve_ok");
                    setconvertButton(buttonstr);
                }
            }
            setLoading(false);
        } catch (e) {
            setLoading(false);
            const buttonstr = t("aptos.resolve_fail");
            setconvertButton(buttonstr);
            window.console.error(e);
        }
    };

    return (
        <>
            <Backdrop
                sx={{color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
            >
                <CircularProgress color="inherit" size={160}/>
            </Backdrop>

            <Card>
                <CardContent>
                    Author: <a href="https://github.com/daog1" target="_blank" rel="noreferrer">daog1</a> @ <a href="https://noncegeek.com" target="_blank" rel="noreferrer">NonceGeek</a>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            aria-readonly
                            id="outlined-multiline-static"
                            label={t("aptos.u8input")}
                            value={input}
                            onChange={(v) => {
                                setInput(v.target.value);
                            }}
                            multiline
                            rows={10}
                        />
                    </Stack>
                </CardContent>
                <CardActions>
                    <Button variant="contained" fullWidth onClick={handleCheck}>
                        {convertButton}
                    </Button>
                </CardActions>
            </Card>
        </>
    );
}
