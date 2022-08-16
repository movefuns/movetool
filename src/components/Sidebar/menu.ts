import TokenIcon from '@mui/icons-material/Token';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import NetworkPingIcon from '@mui/icons-material/NetworkPing';
import ReduceCapacityIcon from '@mui/icons-material/ReduceCapacity';
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
        name: "transfer-convert",
        name_i18_key: "menu.batch_convert",
        icon: TransferWithinAStationIcon,
        path: "/stc/batch/transfer-convert"
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

    {
        name: "donate",
        name_i18_key: "menu.donate",
        icon: ReduceCapacityIcon,
        path: "/donate"
    },

    {
        name: "constract_deploy",
        name_i18_key: "menu.constract_deploy",
        icon: ReduceCapacityIcon,
        path: "/constract/deploy"
    },
]

const menu = [
    {name:"",menu:common_menu},
    {name:"menu.games",menu:game_menu},
]

export default menu