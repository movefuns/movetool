import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useWallet } from "@mysten/wallet-adapter-react";

export function Inventory() {
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
          <CardContent>
            <Typography gutterBottom variant="h4" component="div">
              Inventory State:
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              TreasuryBox: 100
            </Typography>
          </CardContent>
        </Card>
      );
}
