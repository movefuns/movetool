import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
    Alert, Backdrop, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl, InputLabel, MenuItem, Select, SelectChangeEvent,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup, useTheme
} from "@mui/material";

import {useTranslation} from "react-i18next";
import {useMemo, useState} from "react";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { decodeCheckEvent, gameShowdownCheck, getBankAmount} from "../../../games/showdown";
import {ADMIN_ADDRESS} from "../../../games";
import {NANO_STC} from "../../../utils/consts";
import {getEventsByTxnHash, getTxnData} from "../../../utils/sdk";
import {sleep} from "../../../utils/common";
import Typography from "@mui/material/Typography";
import {getLocalNetwork} from "../../../utils/localHelper";


export default function Showdown() {
    const {t} = useTranslation();

    const [loading, setLoading] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [result, setResult] = React.useState(false);
    let [txHash, setTxHash] = useState("")

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleGoToScan = () => {
        const network = getLocalNetwork() || "main"
        window.open(`https://stcscan.io/${network}/transactions/detail/${txHash}`, "_blank")
    }

    let [amount, setAmount] = useState("0.1")
    let [bankAmount, setBankAmount] = useState(0)

    const [input, setInput] = useState("1")
    const theme = useTheme()
    const [token, setToken] = useState("0x00000000000000000000000000000001::STC::STC")
    const [tokenList] = useState<string[]>(["0x00000000000000000000000000000001::STC::STC"])
    const handleChangeToken = (event: SelectChangeEvent) => {
        setToken(event.target.value as string);
    };

    useMemo(async () => {
        const rs = await getBankAmount(token)
        if (rs) {
            setBankAmount(rs)
        }
    }, [token])

    const handleCheck = async () => {
        try {
            setLoading(true)
            setTxHash("")
            const rs = await gameShowdownCheck(token, input === "1", Number(amount) * NANO_STC)
            if (rs) {
                setTxHash(rs)
                let txData = await getTxnData(rs)
                let times = 0;
                while (!txData && times++ < 60) {
                    await sleep(1000)
                    txData = await getEventsByTxnHash(rs)
                    window.console.info("tx", times, txData)
                }

                if (txData) {
                    for (const event of txData) {
                        window.console.info("event", event.type_tag, `${ADMIN_ADDRESS}::GameShowdown::CheckEvent`)
                        if (event.type_tag.toLowerCase() === `${ADMIN_ADDRESS}::GameShowdown::CheckEvent`.toLowerCase()) {
                            const checkEvent = decodeCheckEvent(event.data)
                            if (checkEvent.input === checkEvent.result) {
                                setResult(true)
                                setLoading(false)
                                setOpenDialog(true)
                            } else {
                                setOpenDialog(true)
                                setLoading(false)
                                setResult(false)
                            }
                            break;
                        }
                    }
                }

            }

            setLoading(false)
        } catch (e) {
            setLoading(false)
            window.console.error(e)
        }

    };

    return <>

        <Backdrop
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open={loading}
        >
            <CircularProgress color="inherit" size={160}/>
        </Backdrop>


        <Dialog
            open={openDialog}
            keepMounted
            onClose={handleCloseDialog}
            aria-describedby="alert-dialog-slide-description"
            fullWidth={true}
        >
            <DialogTitle> your {result ? "win" : "lose"}   </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description" align={"center"}>
                    <Typography variant="h1" component="span" gutterBottom>
                        {result ? "win" : "lose"}
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleGoToScan}> view on scan </Button>
                <Button onClick={handleCloseDialog}>close</Button>
            </DialogActions>
        </Dialog>
        <Card>
            <CardContent>
                <Stack spacing={2}>

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

                    <Alert severity="info">This Banker Amount: {bankAmount} , max input
                        amount {bankAmount / 10}  </Alert>


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
                        style={{margin: "20px auto"}}
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