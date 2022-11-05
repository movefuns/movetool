import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useWallet } from "@mysten/wallet-adapter-react";

export default function SuiConstractCall() {
    const { connected, getAccounts, signAndExecuteTransaction } = useWallet();

    const handleClick = async () => {
        const hash = await signAndExecuteTransaction({
            kind: "moveCall",
            data: {
                packageObjectId: "0x2",
                module: "devnet_nft",
                function: "mint",
                typeArguments: [],
                arguments: [
                    "name",
                    "capy",
                    "https://cdn.britannica.com/94/194294-138-B2CF7780/overview-capybara.jpg?w=800&h=450&c=crop",
                ],
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
