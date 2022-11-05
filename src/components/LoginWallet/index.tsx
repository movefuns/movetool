import LoadingButton from '@mui/lab/LoadingButton';
import { useLocation } from 'react-router-dom';
import { StarcoinLoginWallet } from './starcoinLogin';
import { SuiLoginWallet} from './suiLogin';

// login wallet
export default function LoginWallet() {
    const location = useLocation();

    if (location.pathname.startsWith("/sui")) {
        return <SuiLoginWallet/>
    } else {
        return <StarcoinLoginWallet/>
    }
}