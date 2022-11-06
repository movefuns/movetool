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

    const gameObjectID = "0x0626e78a89a53701cc58907a1d68911e07ec4cfb";
    const heroObjectID = "0xc2dffc02669a42434fc592dcc39fce75d5116d17";
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
                  <AutoFight
                    mnemonics="satoshi border lady photo income play mom lawn alter solar habit butter"
                    gameObjectID={gameObjectID} 
                    heroObjectID={heroObjectID} 
                    monsterName="boar_king" 
                    onFightSuccess={onRobotFightSuccess}
                    />
                </Grid>

                <Grid item xs={6}>
                  <AutoFight
                      mnemonics="lecture claim inquiry flee tortoise shine frost until stairs swallow random major"
                      gameObjectID={gameObjectID} 
                      heroObjectID={heroObjectID} 
                      monsterName="boar" 
                      onFightSuccess={onRobotFightSuccess}
                      />
                </Grid>

                <Grid item xs={6}>
                  <AutoFight
                      mnemonics="satoshi border lady photo income play mom lawn alter solar habit butter"
                      gameObjectID={gameObjectID} 
                      heroObjectID={heroObjectID} 
                      monsterName="boar" 
                      onFightSuccess={onRobotFightSuccess}
                      />
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
