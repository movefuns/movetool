import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
    FormControl, InputLabel, MenuItem, Select, SelectChangeEvent,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup, useTheme
} from "@mui/material";
import * as React from "react";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";


export default function Showdown() {
    const {t} = useTranslation();
    let [amount, setAmount] = useState("1")
    const [input, setInput] = useState("1")
    const theme = useTheme()
    const [token, setToken] = useState("0x00000000000000000000000000000001::STC::STC")
    const [tokenList, setTokenList] = useState<string[]>(["0x00000000000000000000000000000001::STC::STC"])
    const handleChangeToken = (event: SelectChangeEvent) => {
        setToken(event.target.value as string);
    };

    const handleCheck = async () => {
    };

    return <>
        <Card>


            <CardContent >
                <Stack spacing={2} >

                    <Box sx={{minWidth: 120}}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Token</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={token}
                                label="Token"
                                onChange={handleChangeToken}
                            >
                                {tokenList.map((item, index) => {
                                    return <MenuItem key={item} selected={index === 0} value={item}>{item}</MenuItem>
                                })}

                            </Select>
                        </FormControl>
                    </Box>

                    <TextField
                        fullWidth

                        aria-readonly
                        id="outlined-multiline-static"
                        label={t("showdown.amount")}
                        value={amount}
                        onChange={(v) => {
                            setAmount(v.target.value)
                        }}
                        multiline
                        rows={1}/>



                    <ToggleButtonGroup
                        style={{margin:"20px auto"}}
                        value={input}
                        exclusive
                        onChange={(_, value) => {
                            setInput(value)
                        }}
                        aria-label="text alignment"

                    >
                        <ToggleButton value="1" aria-label="left aligned"
                                      style={{fontSize: theme.spacing(12), padding: theme.spacing(4)}}>
                            {t("showdown.true")}
                        </ToggleButton>
                        <ToggleButton value="0" aria-label="centered"
                                      style={{fontSize: theme.spacing(12), padding: theme.spacing(4)}}>
                            {t("showdown.false")}
                        </ToggleButton>

                    </ToggleButtonGroup>
                </Stack>

            </CardContent>

            <CardActions>
                <Button variant="contained" fullWidth onClick={handleCheck}>{t("showdown.check")}</Button>
            </CardActions>
        </Card>
    </>
}