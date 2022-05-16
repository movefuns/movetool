import LoadingButton from '@mui/lab/LoadingButton';
import * as React from "react";
import StarMaskOnboarding from '@starcoin/starmask-onboarding'
import {set} from '../../store/wallet'
import {useDispatch} from "react-redux";
import {requestAccounts} from "../../utils/stcWalletSdk";
import {useTranslation} from 'react-i18next';
import {useState} from "react";

declare global {
    interface Window {
        store: any;
        starcoin: any
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    }
}

// login wallet
export default function LoginWallet() {
    const {t} = useTranslation();
    const {isStarMaskInstalled} = StarMaskOnboarding
    const [loading, setLoading] = useState(false)
    const [buttonText, setButtonText] = useState(t("menu.login") as string)
    const dispatch = useDispatch()

    const handleClick = async () => {

        setLoading(true);
        if (!isStarMaskInstalled()) {
            // go to install
            alert(" please install starmask at https://chrome.google.com/webstore ")
            return
        }

        const newAccounts = await requestAccounts()
        setButtonText(newAccounts)
        dispatch(set(newAccounts))
        setLoading(false);
    }

    return <LoadingButton

        onClick={handleClick}
        loading={loading}
        loadingIndicator="Loading..."
        variant="contained"
    >
        {buttonText}
    </LoadingButton>
}