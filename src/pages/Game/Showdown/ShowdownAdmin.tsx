import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
    FormControl, InputLabel, MenuItem, Select, SelectChangeEvent,
    Stack,
    TextField,
    useTheme
} from "@mui/material";
import * as React from "react";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {gameShowdownDeposit, gameShowdownInitBank, gameShowdownWithdraw} from "../../../games/showdown";
import {NANO_STC} from "../../../utils/consts";


export default function ShowdownAdmin() {
    const {t} = useTranslation();
    let [amount, setAmount] = useState("1")
    const theme = useTheme()
    const [token, setToken] = useState("0x00000000000000000000000000000001::STC::STC")
    const [tokenList, setTokenList] = useState<string[]>(["0x00000000000000000000000000000001::STC::STC"])
    const handleChangeToken = (event: SelectChangeEvent) => {
        setToken(event.target.value as string);
    };

    const handleInit = async () => {
        await gameShowdownInitBank(token,Number(amount)*NANO_STC)
    };
    const handleWithdraw = async () => {
        await gameShowdownWithdraw(token,Number(amount)*NANO_STC)
    };
    const handleDeposit = async () => {
        await gameShowdownDeposit(token,Number(amount)*NANO_STC)
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
                </Stack>

            </CardContent>

            <CardActions>
                <Button variant="contained" fullWidth onClick={handleInit}>init</Button>
                <Button variant="contained" fullWidth onClick={handleWithdraw}>withdraw</Button>
                <Button variant="contained" fullWidth onClick={handleDeposit}>deposit</Button>
            </CardActions>
        </Card>
    </>
}