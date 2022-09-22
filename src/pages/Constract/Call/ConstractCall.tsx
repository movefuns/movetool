import Box from '@mui/material/Box';
import { isString } from 'lodash';
import { useTranslation } from "react-i18next";
import { Alert, AlertColor, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Snackbar, Stack, TextField, } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { callContractWithSigner } from '../../../utils/stcWalletSdk';
import { callV2 } from '../../../utils/sdk';
import { useState } from 'react';

type Props = {
    codes: any
}

function FunctionItem(props: Props) {
    const { t } = useTranslation();

    const [tipsType, setTipsType] = useState<AlertColor>("error")
    const [tips, setTips] = useState("")
    const [openTips, setOpenTips] = useState(false);

    const showSuccess = function (msg: string) {
        setTipsType("success")
        setTips(msg)
        setOpenTips(true)
    }

    const showError = function (msg: string) {
        setTipsType("error")
        setTips(msg)
        setOpenTips(true)
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenTips(false);
    };

    const { codes } = props;

    const [argsInputDialog, setArgsInputDialog] = useState(false)

    const [args, setArgs] = useState([])
    const [tyArgs, setTyArgs] = useState([])

    const [functionId, setFunctionId] = useState('')

    const [argsValue, setArgsValue] = useState<Array<any>>([])
    const [tyArgsValue, setTyArgsValue] = useState<Array<string>>([])
    const [signer, setSigner] = useState(true)

    const onChange = (ty: boolean, v: string, i: number) => {
        if (ty) {
            tyArgsValue[i] = v
        } else {
            argsValue[i] = v
        }
    }

    const clearAgrsValue = () => {
        setArgsValue([])
        setTyArgsValue([])
    }

    const handleArgsRun = () => {
        setArgsInputDialog(false)
        call(signer, functionId)
    }

    const openArgsInputDialog = (item: any) => {
        setArgsInputDialog(true)
        setArgs(item.args.filter((v: any) => v.type_tag !== 'Signer'))
        setTyArgs(item.ty_args)
    }

    const handleTryRun = (item: any) => {

        if (!window.starcoin.selectedAddress) {
            showError(t('contract_call.token_address_required'))
            return
        }

        let id = `${item.module_name.address}::${item.module_name.name}::${item.name}`
        let needSigner = item.args.length > 0 && item.args[0].type_tag === "Signer"

        if (id !== functionId) {
            setFunctionId(id)
            setSigner(needSigner)
            clearAgrsValue()
        }

        if (item.args.length > 0 && needSigner === false || item.ty_args.length > 0) {
            openArgsInputDialog(item)
            return
        }

        call(needSigner, id)
    }

    const call = async (signer: boolean, id: string) => {

        if (signer) {
            callContractWithSigner(id, tyArgsValue, argsValue).then((s) => {
                if (s) {
                    showSuccess(s)
                }
            }).catch((e) => {
                showError(e.message)
            })

        } else {
            callV2(id, tyArgsValue, argsValue).then((s) => {
                if (s) {
                    showSuccess(s)
                }
            }).catch((e) => {
                showError(e.message)
            })
        }
    }

    return (<Box>

        <Snackbar open={openTips} autoHideDuration={6000} onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleClose} severity={tipsType} sx={{ width: '100%' }}>
                {tips}
            </Alert>
        </Snackbar>

        <Dialog
            open={argsInputDialog}
            keepMounted
            // onClose={handleCloseDialog}
            aria-describedby="alert-dialog-slide-description"
            fullWidth={true}
        >
            <DialogTitle> {t('contract_call.parameter')} </DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <div>{tyArgs.length > 0 ? 'TyArgs' : ''}</div>
                    {
                        tyArgs.map((e: any, i: any) => <TextField key={e.name + functionId} label={e.name} onChange={(e) => onChange(true, e.target.value, i)}></TextField>)
                    }

                    <div>{args.length > 0 ? 'Args' : ''}</div>
                    {
                        args.map((e: any, i: any) => {

                            return <TextField key={e.name + functionId} label={e.name} onChange={(e) => onChange(false, e.target.value, i)}></TextField>
                        })
                    }
                </Stack>

                {/* </DialogContentText> */}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    setArgsInputDialog(false)
                    clearAgrsValue()

                }}> Close </Button>
                <Button onClick={handleArgsRun}>Run</Button>
            </DialogActions>
        </Dialog>

        {codes.map((item: any, index: any) => {

            const tyArg = item.ty_args.map((arg: any) => {
                return arg.name
            }).join(', ')

            const arg = item.args.map((arg: any) => {
                let type_tag
                if (isString(arg.type_tag)) {
                    type_tag = arg.type_tag
                } else {
                    type_tag = Object.keys(arg.type_tag).map((key) => {
                        return `${key}<${arg.type_tag[key]}>`;
                    }).join(', ')
                }
                return `${arg.name}: ${type_tag}`
            }).join(', ')

            return <Box
                id={`function${item.name}${index}`}
                key={item.name + index}
                sx={{ height: 60 }}>

                <ListItem
                    // disablePadding
                    secondaryAction={
                        <IconButton edge="end" aria-label="run" onClick={() => handleTryRun(item)}>
                            <PlayArrowIcon />
                        </IconButton>
                    }>
                    <ListItemIcon>

                        <ListItemText sx={{ dense: 'false' }} primary={`${item.name} ( ${arg} ${tyArg.length > 0 ? ',' : ''}  ${tyArg} ) `} />

                    </ListItemIcon>
                    {/* <Divider /> */}
                </ListItem>
                <Divider />
            </Box>
        })}

    </Box>);
}

export default function CodeContent(props: Props) {
    const { codes } = props;

    if (codes.length === 0) {
        return <div />
    }

    return (
        <Box sx={{ height: '100%', flexGrow: 1, maxWidth: '100%', overflowY: 'auto' }}>

            <List sx={{ width: '100%' }}
            >
                {
                    codes[0].code.script_functions.length > 0 ? <FunctionItem codes={codes[0].code.script_functions} /> : <p>no function</p>
                }
            </List>
        </Box >
    );
}