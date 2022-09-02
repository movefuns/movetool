import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
    Alert,
    Backdrop,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    useTheme,
} from "@mui/material";

import {useTranslation} from "react-i18next";
import {useMemo, useState} from "react";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {
    decodeCheckEvent,
    gameFingerGuessing,
    getBankAmount,
} from "../../../games/finger_guessing";
import {ADMIN_ADDRESS} from "../../../games";
import {NANO_STC} from "../../../utils/consts";
import {getEventsByTxnHash, getTxnData} from "../../../utils/sdk";
import {sleep} from "../../../utils/common";
import Typography from "@mui/material/Typography";
import {getLocalNetwork} from "../../../utils/localHelper";
import { BigNumber } from "bignumber.js";

const guessResult = {
  0:"Draw",
  1:"Win",
  2:"Loss",
}


export default function FingerGuessing() {
    const {t} = useTranslation();

    const [loading, setLoading] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [result, setResult] = React.useState(0);
    const [input, setInput] = useState("0");
    let [txHash, setTxHash] = useState("");

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleGoToScan = () => {
        const network = getLocalNetwork() || "main";
        window.open(
            `https://stcscan.io/${network}/transactions/detail/${txHash}`,
            "_blank"
        );
    };

    let [amount, setAmount] = useState("0.1");
    let [bankAmount, setBankAmount] = useState(0);


    const theme = useTheme();
    const [token, setToken] = useState(
        "0x00000000000000000000000000000001::STC::STC"
    );
    const [tokenList] = useState<string[]>([
        "0x00000000000000000000000000000001::STC::STC",
    ]);
    const handleChangeToken = (event: SelectChangeEvent) => {
        setToken(event.target.value as string);
    };

    useMemo(async () => {
        const rs = await getBankAmount(token);
        if (rs) {
            setBankAmount(rs);
        }
    }, [token]);

    const handleCheck = async () => {
        try {
            setLoading(true);
            setTxHash("");
            const rs = await gameFingerGuessing(
                token,
                input === "1",
                Number(amount) * NANO_STC
            );
            if (rs) {
                setTxHash(rs);
                let txData = await getTxnData(rs);
                let times = 0;
                while (!txData && times++ < 60) {
                    await sleep(1000);
                    txData = await getEventsByTxnHash(rs);
                    window.console.info("tx", times, txData);
                }

                if (txData) {
                    for (const event of txData) {
                        window.console.info(
                            "event",
                            event.type_tag,
                            `${ADMIN_ADDRESS}::GameFingerGuessing::CheckEvent`
                        );
                        if (
                            event.type_tag.toLowerCase() ===
                            `${ADMIN_ADDRESS}::GameFingerGuessing::CheckEvent`.toLowerCase()
                        ) {
                            const checkEvent = decodeCheckEvent(event.data);
                           window.console.info(checkEvent)
                            const input = checkEvent.input;
                            const result = checkEvent.result;
                            if (input === result) {
                                // 平局
                                setResult(0);
                                setLoading(false);
                                setOpenDialog(true);
                            } else if ((input === 0 && result === 2)
                                || (input === 1 && result === 0) ||
                                (input === 2 && result === 1)) {
                                // win
                                setResult(1);
                                setLoading(false);
                                setOpenDialog(true);
                            } else {
                                // loss
                                setOpenDialog(true);
                                setLoading(false);
                                setResult(2);
                            }
                            break;
                        }
                    }
                }
            }

            setLoading(false);
        } catch (e) {
            setLoading(false);
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

            <Dialog
                open={openDialog}
                keepMounted
                onClose={handleCloseDialog}
                aria-describedby="alert-dialog-slide-description"
                fullWidth={true}
            >
                <DialogTitle> your {guessResult[result]} </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-slide-description"
                        align={"center"}
                    >
                        <Typography variant="h1" component="span" gutterBottom>
                            {guessResult[result]}
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
                                        return (
                                            <MenuItem key={item} selected={index === 0} value={item}>
                                                {item}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Box>

                        <Alert severity="info">
                            This Banker Amount: {bankAmount} , max input amount{" "}
                            {new BigNumber(bankAmount).div(10).toString()}{" "}
                        </Alert>

                        <TextField
                            fullWidth
                            aria-readonly
                            id="outlined-multiline-static"
                            label={t("showdown.amount")}
                            value={amount}
                            onChange={(v) => {
                                setAmount(v.target.value);
                            }}
                            multiline
                            rows={1}
                        />

                        <ToggleButtonGroup
                            style={{margin: "20px auto"}}
                            value={input}
                            exclusive
                            onChange={(_, value) => {
                                setInput(value);
                            }}
                            aria-label="text alignment"
                        >

                            <ToggleButton
                                value="0"
                                aria-label="centered"
                                style={{
                                    fontSize: theme.spacing(8),
                                    padding: theme.spacing(4),
                                }}
                            >
                                <svg
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="27742"
                                    fill={theme.palette.getContrastText(theme.palette.background.paper)}
                                    width="100"
                                    height="100"
                                >
                                    <path
                                        d="M817.728 158.104c-44.802-67.796-132.216-84.546-197.626-47.176-58.948-62.938-158.29-62.186-216.668-0.044-94.32-54.04-217.42 10.11-221.342 121.612C89.692 210.814 0 280.002 0 374.858v113.906c0 65.482 28.56 127.908 78.36 171.268l195.42 170.162c8.504 7.404 6.22 11.146 6.22 65.806 0 35.346 28.654 64 64 64h504c35.346 0 64-28.654 64-64 0-47.026-2.03-61.49 7.964-84.74l85.67-199.312c12.188-28.354 18.366-58.344 18.366-89.136V293.926c0-105.678-108.628-177.324-206.272-135.822zM928 522.812a129.01 129.01 0 0 1-10.564 51.226l-85.67 199.31c-10.46 24.342-15.766 50.08-15.766 76.5V864H376v-20.572c0-32.74-14.28-63.954-39.18-85.634l-195.42-170.16C112.548 562.51 96 526.472 96 488.762v-113.906c0-66.416 104-67.074 104 1.354v82.456a32 32 0 0 0 10.986 24.134l14 12.19A32 32 0 0 0 278 470.858V237.714c0-66.194 104-67.45 104 1.354v53.502c0 17.672 14.328 32 32 32h14c17.672 0 32-14.328 32-32v-82.286c0-66.268 104-67.35 104 1.354v80.932c0 17.672 14.326 32 32 32h14c17.674 0 32-14.328 32-32v-54.858c0-66.06 104-67.56 104 1.354v53.502c0 17.672 14.326 32 32 32h14c17.674 0 32-14.328 32-32 0-66.292 104-67.226 104 1.354v228.89z"
                                        p-id="27742"
                                    ></path>
                                </svg>
                            </ToggleButton>

                            <ToggleButton
                                value="1"
                                aria-label="left aligned"
                                style={{
                                    fontSize: theme.spacing(8),
                                    padding: theme.spacing(4),
                                }}
                            >
                                <svg
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="27601"
                                    fill={theme.palette.getContrastText(theme.palette.background.paper)}
                                    width="100"
                                    height="100"
                                >
                                    <path
                                        d="M512 960l140-0.026c10.228 0 20.462-1.166 30.406-3.458l237.998-54.854C981.12 887.67 1024 834.04 1024 772.554V361.15c0-47.69-26.06-91.902-68.01-115.38l-195.998-109.706c-68.818-38.522-134.526-11.648-184.436 49.466L285.7 74.016c-75.774-29.158-161.224 7.454-191.284 82.402-30.196 75.284 7.27 160.74 83.884 190.224L336 384l-188-18.282c-81.608 0-148 65.622-148 146.28 0 80.66 66.392 146.282 148 146.282h175.27c-7.35 52.49 17.384 102.594 60.682 130.012C357.314 873.474 422.088 960 512 960z m0-96.026c-50.32 0-50.24-73.134 0-73.134 17.674 0 32-14.326 32-32v-13.712c0-17.674-14.326-32-32-32h-56c-50.318 0-50.244-73.134 0-73.134h56c17.674 0 32-14.326 32-32v-13.712c0-17.674-14.326-32-32-32H148c-68.86 0-68.75-100.562 0-100.562h364c17.674 0 32-14.326 32-32v-23.264a32 32 0 0 0-20.508-29.866L212.778 257.02c-63.104-24.28-26.864-118.566 38.444-93.434l333.098 128.182a32.002 32.002 0 0 0 36.278-9.624l43.528-53.294c11.64-14.254 32.696-18.128 48.976-9.016l196 109.708c11.656 6.526 18.898 18.636 18.898 31.61v411.402c0 16.982-11.988 31.608-29.152 35.564l-238.002 54.854a39.486 39.486 0 0 1-8.846 1.004h-140z"
                                        p-id="27601"
                                    ></path>
                                </svg>
                            </ToggleButton>
                            <ToggleButton
                                value="2"
                                aria-label="centered"
                                style={{
                                    fontSize: theme.spacing(8),
                                    padding: theme.spacing(4),
                                }}
                            >


                                <svg
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="27463"
                                    width="100"
                                    height="100"
                                    fill={theme.palette.getContrastText(theme.palette.background.paper)}
                                >
                                    <path
                                        d="M809.139447 225.282593v-21.649984c0-87.223935-81.03994-153.381886-166.077877-131.091903-51.257962-98.999927-188.17986-94.89993-235.963825 1.493999C324.537807 52.912721 242.287868 115.890674 242.287868 204.000609v252.259812c-39.90597-14.853989-86.615936-10.135992-124.165908 17.741987-58.709956 43.591968-71.587947 126.665906-29.099979 186.305862L328.959803 997.13802a63.999953 63.999953 0 0 0 52.123962 26.86398h445.793669c29.807978 0 55.669959-20.577985 62.363954-49.625963l60.367955-261.915806A407.273698 407.273698 0 0 0 959.999335 621.128299V358.000494c0-81.23994-71.045947-143.983893-150.859888-132.717901z m54.853959 395.843706c0 23.461983-2.667998 46.937965-7.929994 69.771948L801.413453 928.000071h-403.839701L167.181923 604.606311c-28.877979-40.53997 30.045978-85.551937 58.787957-45.209966l54.25596 76.157943c17.989987 25.251981 58.061957 12.573991 58.061956-18.565986V204.000609c0-51.289962 73.141946-49.619963 73.141946 1.381999V512.00038c0 17.673987 14.325989 31.999976 31.999976 31.999976h13.71199c17.673987 0 31.999976-14.325989 31.999976-31.999976V134.000661c0-51.325962 73.141946-49.619963 73.141946 1.381999V512.00038c0 17.673987 14.325989 31.999976 31.999976 31.999976h13.71199c17.673987 0 31.999976-14.325989 31.999977-31.999976V202.25061c0-51.343962 73.139946-49.619963 73.139945 1.381999V512.00038c0 17.673987 14.325989 31.999976 31.999976 31.999976h13.71399c17.673987 0 31.999976-14.325989 31.999977-31.999976v-152.617887c0-52.483961 73.139946-51.279962 73.139945-1.381999v263.125805z"
                                        p-id="27463"
                                    ></path>
                                </svg>
                            </ToggleButton>

                        </ToggleButtonGroup>
                    </Stack>
                </CardContent>

                <CardActions>
                    <Button variant="contained" fullWidth onClick={handleCheck}>
                        {t("finger_guessing.check")}
                    </Button>
                </CardActions>
            </Card>
        </>
    );
}
