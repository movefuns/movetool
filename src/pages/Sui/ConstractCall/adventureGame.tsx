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
    const { connected, wallet, getAccounts, signAndExecuteTransaction } = useWallet();
    const [ hash, setHash] = useState<string>("")
    const [treasuryBoxObjectID, setTreasuryBoxObjectID] = useState<string>("")

    const gameObjectID = "0xc332401043f96c875fad94da189f7be21cdeea4f";
    const heroObjectID = "0xc1095028c4a01e092f16698c5d4a3cf201e72226";

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

    useEffect(() => {
      async function queryTreasuryBox() {
        const address = getAccounts()[0]
        const objects = await provider.getObjectsOwnedByAddress(
          address
        ) as any;

        for (let i = 0; i < objects.length; i++) {
          const obj = objects[i]
          if (obj.type.includes('TreasuryBox')) {
            setTreasuryBoxObjectID(obj.objectId)
            break
          }
        }
      }

      queryTreasuryBox();
    }, [hash])

    return (
        <Card sx={{ minWidth: 275 }}>
            <Typography gutterBottom variant="h2" component="div">
              Adventure Game
            </Typography>

            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <HeroStat heroObjectID={heroObjectID} hash={hash}/>
                  <Typography gutterBottom variant="h5" component="div">
                      TreasuryBox: { treasuryBoxObjectID }
                  </Typography>
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

                    <Button onClick={onGetFlag} disabled={!connected}>
                      get flag
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
