import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Stack, TextField } from "@mui/material";
import { useState } from 'react';
import { AdventureGame } from "./adventureGame";

export default function SuiAdventureGame() {
  const [gaming, setGaming] = useState<boolean>(false)
  const [gameObjectID, setGameObjectID] = useState<string>("")
  const [heroObjectID, setHeroObjectID] = useState<string>("")

  const onNewGame = async () => {
    if (gameObjectID === "") {
      alert("Please input game object ID")
      return
    }

    if (heroObjectID === "") {
      alert("Please input hero object ID")
      return
    }

    setGaming(true)
  }

  const onGameExit = async () => {
    setGaming(false)
    setGameObjectID("")
    setHeroObjectID("")
  }

  return (
    <>
      <Typography gutterBottom variant="h2" component="div">
        Adventure Game
      </Typography>

      {gaming ? (
        <AdventureGame gameObjectID={gameObjectID} heroObjectID={heroObjectID} onGameExit={onGameExit} />
      ) : (
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Stack spacing={2}>
              <TextField fullWidth id="gameObjectID" value={gameObjectID} autoFocus={true} onChange={(v) => {
                setGameObjectID(v.target.value)
              }} label="gameObjectID:" variant="outlined" />

              <TextField fullWidth id="heroObjectID" value={heroObjectID} onChange={(v) => {
                setHeroObjectID(v.target.value)
              }} label="heroObjectID:" variant="outlined" />
            </Stack>
          </CardContent>
          <CardActions>
            <Button variant="contained" fullWidth onClick={onNewGame}>New Game</Button>
          </CardActions>
        </Card>
      )}
    </>
  );
}