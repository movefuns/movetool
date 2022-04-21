import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import StarMaskOnboarding from '@starcoin/starmask-onboarding'
import {set} from './../../store/wallet'
import {useDispatch} from "react-redux";

declare global {
    interface Window {
        store: any;
        starcoin: any
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    }
}

type Props = {
    open: boolean
}

// login wallet
export default function LoginWallet(props: Props) {
    const {isStarMaskInstalled} = StarMaskOnboarding
    const dispatch = useDispatch()

    const clickItem = async () => {
        if (!isStarMaskInstalled()) {
            // go to install
            alert("请先安装starmask")
            return
        }


        const newAccounts = await window.starcoin.request({
            method: 'stc_requestAccounts',
        })
        dispatch(set(newAccounts))

        console.info(newAccounts)
    }

    const {open} = props
    return <ListItemButton onClick={clickItem}>
        <ListItemText primary="登陆" sx={{opacity: open ? 1 : 0}}/>
    </ListItemButton>
}