import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useWallet } from "@mysten/wallet-adapter-react";
import { HeroStat } from "./heroStat";
import { AutoFight } from "./autoFight";
import { JsonRpcProvider } from '@mysten/sui.js';

const provider = new JsonRpcProvider('https://fullnode.devnet.sui.io', {
        // you can also skip providing this field if you don't plan to interact with the faucet
        faucetURL: 'https://faucet.devnet.sui.io',
    });

export function AdventureGame() {
    const { connected, signAndExecuteTransaction } = useWallet();
    const [ hash, setHash] = useState<string>("")

    const gameObjectID = "0xf7d4f740147c7fd39f3715918c4e7f97d367f92d";
    const heroObjectID = "0x7ad3e649bd81b4278e7f67ca0c48bad83d0b5250";

    const onSlayBoar = async () => {
      const hash = await signAndExecuteTransaction({
          kind: "moveCall",
          data: {
              packageObjectId: gameObjectID,
              module: "adventure",
              function: "slay_boar",
              typeArguments: [],
              arguments: [heroObjectID],
              gasBudget: 10000,
          },
      });

      setHash(hash.certificate.transactionDigest);
      alert("signAndExecuteTransaction:" + hash.certificate.transactionDigest)
    };

    const onSlayBoarKing = async () => {
      const hash = await signAndExecuteTransaction({
          kind: "moveCall",
          data: {
              packageObjectId: gameObjectID,
              module: "adventure",
              function: "slay_boar_king",
              typeArguments: [],
              arguments: [heroObjectID],
              gasBudget: 10000,
          },
      });

      setHash(hash.certificate.transactionDigest);
      alert("signAndExecuteTransaction:" + hash.certificate.transactionDigest)
    };

    const onLevelUp = async () => {
      const hash = await signAndExecuteTransaction({
          kind: "moveCall",
          data: {
              packageObjectId: gameObjectID,
              module: "hero",
              function: "level_up",
              typeArguments: [],
              arguments: [heroObjectID],
              gasBudget: 10000,
          },
      });

      setHash(hash.certificate.transactionDigest);
      alert("signAndExecuteTransaction:" + hash.certificate.transactionDigest)
    };

    const onRobotFightSuccess = async (hash: string) => {
      setHash(hash);
    };

    return (
        <Card sx={{ minWidth: 275 }}>
            <Typography gutterBottom variant="h2" component="div">
              Adventure Game
            </Typography>

            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <HeroStat heroObjectID={heroObjectID} hash={hash}/>
                </Grid>
                <Grid item xs={12}>
                  <Card sx={{ minWidth: 275 }}>
                    <Button onClick={onSlayBoar} disabled={!connected}>
                      slay boar
                    </Button>

                    <Button onClick={onSlayBoarKing} disabled={!connected}>
                      slay boar king
                    </Button>

                    <Button onClick={onLevelUp} disabled={!connected}>
                      level up
                    </Button>
                  </Card>
                </Grid>

                <Grid item xs={4}>
                  <AutoFight
                    mnemonics="mammal safe economy collect enemy solar outdoor lemon apart fame program kit"
                    gameObjectID={gameObjectID} 
                    heroObjectID={heroObjectID} 
                    onFightSuccess={onRobotFightSuccess}
                    />
                </Grid>

                <Grid item xs={4}>
                  <AutoFight
                      mnemonics="layer assist team plate city connect high harsh call tray sweet erupt"
                      gameObjectID={gameObjectID} 
                      heroObjectID={heroObjectID} 
                      onFightSuccess={onRobotFightSuccess}
                      />
                </Grid>

                <Grid item xs={4}>
                  <AutoFight
                      mnemonics="snake ticket acoustic paper wrap crane trophy scheme gentle large depth actress"
                      gameObjectID={gameObjectID} 
                      heroObjectID={heroObjectID} 
                      onFightSuccess={onRobotFightSuccess}
                      />
                </Grid>
              </Grid>
            </Box>
        </Card >
    );
}
