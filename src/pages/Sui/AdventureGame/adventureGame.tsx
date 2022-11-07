import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useTranslation } from "react-i18next";
import { useWallet } from "@mysten/wallet-adapter-react";
import { HeroStat } from "./heroStat";
import { AutoFight } from "./autoFight";

type Props = {
  gameObjectID: string;
  heroObjectID: string;
  onGameExit?: () => void;
}

export function AdventureGame(props: Props) {
  const {t} = useTranslation();
  const { connected, signAndExecuteTransaction } = useWallet();
  const [hash, setHash] = useState<string>("")

  const gameObjectID = props.gameObjectID;
  const heroObjectID = props.heroObjectID;

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

  const onExitGame = async () => {
    if (props.onGameExit) {
      props.onGameExit()
    }
  }

  const onRobotFightSuccess = async (hash: string) => {
    setHash(hash);
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <HeroStat heroObjectID={heroObjectID} hash={hash} />
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ minWidth: 275 }}>
              <Button onClick={onSlayBoar} disabled={!connected}>
                {t("sui_adventure_game.slay_boar")}
              </Button>

              <Button onClick={onSlayBoarKing} disabled={!connected}>
                {t("sui_adventure_game.slay_boar_king")}
              </Button>

              <Button onClick={onLevelUp} disabled={!connected}>
                {t("sui_adventure_game.level_up")}
              </Button>

              <Button onClick={onExitGame} disabled={!connected}>
                {t("sui_adventure_game.exit_game")}
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
