import TokenIcon from '@mui/icons-material/Token';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import NetworkPingIcon from '@mui/icons-material/NetworkPing';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import game_menu from  "./game_menu"


const common_menu = [
    {
        name: "0",
        name_i18_key: "menu.issue_token",
        icon: TokenIcon,
        path: "/stc/issue/token"
    },
    {
        name: "1",
        name_i18_key: "menu.batch_token",
        icon: TransferWithinAStationIcon,
        path: "/stc/batch/transfer"
    },
    {
        name: "2",
        name_i18_key: "menu.batch_balance",
        icon: AccountBalanceIcon,
        path: "/stc/batch/balance"
    },

    {
        name: "3",
        name_i18_key: "menu.rpc_ping",
        icon: NetworkPingIcon,
        path: "/node/ping"
    },
    {
        name: "4",
        name_i18_key: "menu.unit",
        icon: ConfirmationNumberIcon,
        path: "/stc/unit/convert"
    },

    {
        name: "5",
        name_i18_key: "menu.chain_record",
        icon: GraphicEqIcon,
        path: "/chain/record"
    },
]

const menu = [
    {name:"",common_menu},
    {name:"menu.games",menu:game_menu},
]

export default menu