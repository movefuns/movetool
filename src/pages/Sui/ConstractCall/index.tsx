import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useWallet } from "@mysten/wallet-adapter-react";

export default function SuiConstractCall() {
    const { connected, getAccounts, signAndExecuteTransaction } = useWallet();

    const handleClick = async () => {
        const hash = await signAndExecuteTransaction({
            kind: "moveCall",
            data: {
                packageObjectId: "0xf065ec8e358979c9a8687a4fd3f8453bc6b172c4",
                module: "checkin",
                function: "get_flag",
                typeArguments: [],
                arguments: [],
                gasBudget: 10000,
            },
        });

        alert("signAndExecuteTransaction:" + hash)
    };

    return (
        <Card sx={{ minWidth: 275 }}>
            测试执行交易：
            <Button onClick={handleClick} disabled={!connected}>
                Send Transaction
            </Button>
        </Card >
    );
}