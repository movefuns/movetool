import { useState } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useWallet } from "@mysten/wallet-adapter-react";
import { HeroStat } from "./heroStat";
import { Inventory } from "./inventory";
import { AutoFight } from "./autoFight";

export function AdventureGame() {
    const { connected, signAndExecuteTransaction } = useWallet();
    const [ hash, setHash] = useState<string>("")

    const gameObjectID = "9e83dd785622350d75c6005aadf5f5ce666be3a2";
    const heroObjectID = "0x4c94f53d21752aca749de8813c152d4940832a37";
    const treasuryBoxObjectID = "xxx";

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

    const onGetFlag = async () => {
      const hash = await signAndExecuteTransaction({
          kind: "moveCall",
          data: {
              packageObjectId: gameObjectID,
              module: "inventory",
              function: "get_flag",
              typeArguments: [],
              arguments: [treasuryBoxObjectID],
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
                <Grid item xs>
                  <HeroStat heroObjectID={heroObjectID} hash={hash}/>
                </Grid>
                
                <Grid item xs={6}>
                  <Inventory heroObjectID={heroObjectID} hash={hash}/>
                </Grid>

                <Grid item xs={6}>
                  <AutoFight gameObjectID={gameObjectID} heroObjectID={heroObjectID} monsterName="boar" onFightSuccess={onRobotFightSuccess}/>
                </Grid>

                <Grid item xs={6}>
                  <AutoFight gameObjectID={gameObjectID} heroObjectID={heroObjectID} monsterName="boar_king" onFightSuccess={onRobotFightSuccess}/>
                </Grid>

              </Grid>
            </Box>

            <Button onClick={onSlayBoar} disabled={!connected}>
                slay boar
              </Button>

              <Button onClick={onSlayBoarKing} disabled={!connected}>
                slay boar king
              </Button>

              <Button onClick={onLevelUp} disabled={!connected}>
                level up
              </Button>

              <Button onClick={onGetFlag} disabled={!connected}>
                get flag
              </Button>
        </Card >
    );
}
