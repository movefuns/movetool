import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useWallet } from "@mysten/wallet-adapter-react";


type Props = {
  heroObjectID: string;
  hash: string;
}

export function Inventory(props: Props) {

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
