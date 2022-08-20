import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Box,
  CardActions,
  Button,
  Snackbar,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { GameModule, startNewGameWithNum, joinGame, endGame, decodeGameEvent } from "../../../games/sicbo_game";
import {getProvder} from "../../../utils/stcWalletSdk";
import { getEventsByTxnHash, getTxnData } from "../../../utils/sdk";
import { sleep } from "../../../utils/common";

const Token = "0x00000000000000000000000000000001::STC::STC";
const TokenList = [Token];

export default function SicBoWithFriend() {
  const { t } = useTranslation();
  const [startAmount, setStartAmount] = useState('0.1')
  const [startNum, setStartNum] = useState("1");
  const [joinNum, setJoinNum] = useState("1");
  const [friendAddr, setFriendAddr] = useState("");
  const [account, setAccount] = useState<string>();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('')

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getProvder().then(provider => {
      return provider.send("stc_requestAccounts", [])
    }).then(accounts => {
      const account = accounts[0];
      setAccount(account);
    })
  }, [])

  const toastMsg = (msg: string) => {
    setOpen(true)
    setMsg(msg)
  }


  const createNewGame = React.useCallback(async () => {
    if (!account) {
      return;
    }
    setLoading(true)
    const rs = await startNewGameWithNum(account, Number(startNum) || 1, Number(startAmount))
    if (rs) {
      let txData = await getTxnData(rs);
      let times = 0;
      while (!txData && times++ < 60) {
          await sleep(1000);
          txData = await getEventsByTxnHash(rs);
          window.console.info("tx", times, txData);
      }
      for(const event of txData) {
        if (
            event.type_tag === `${GameModule}::GameStartEvent`
        ) {
            const gameStartEvent = decodeGameEvent(event.data);
            window.console.log({gameStartEvent})
            toastMsg(t('sio_bo.create_game_success'))
        }
      }
    }
    setLoading(false)
  }, [account, startNum, startAmount, t]);

  const joinGameHandler = React.useCallback(async ()=> {
    if (!account) {
      return;
    }
    if (Math.abs(Number(joinNum)) > 2) {
      return
    }
    setLoading(true)
    const rs = await joinGame(friendAddr, Math.abs(Number(joinNum)))
    if (rs) {
      let txData = await getTxnData(rs);
      let times = 0;
      while (!txData && times++ < 60) {
          await sleep(1000);
          txData = await getEventsByTxnHash(rs);
          window.console.info("tx", times, txData);
      }
      for(const event of txData) {
        if (
            event.type_tag === `${GameModule}::GameJoinEvent`
        ) {
            const gameJoinEvent = decodeGameEvent(event.data);
            window.console.log({gameJoinEvent})
            toastMsg(t('sio_bo.join_game_success'))
        }
      }
    }
    setLoading(false)
  }, [account, friendAddr, joinNum, t])

  const decryptGame = React.useCallback(async () => {
    if (!account) {
      return;
    }
    setLoading(true)
    const rs = await endGame(Number(startNum) || 1)
    if (rs) {
      let txData = await getTxnData(rs);
      let times = 0;
      while (!txData && times++ < 60) {
          await sleep(1000);
          txData = await getEventsByTxnHash(rs);
          window.console.info("tx", times, txData);
      }
      for(const event of txData) {
        if (
            event.type_tag === `${GameModule}::GameEndEvent`
        ) {
            const gameEndEvent = decodeGameEvent(event.data);
            window.console.log({gameEndEvent})
            toastMsg(t('sio_bo.end_game_success'))
        }
      }
    }
    setLoading(false)
  }, [account, startNum, t])

  return (
    <div>
      0: shitou（rock）
      1: jiandao（scissors）
      2: bu（paper）
      <div>
        <h3>{t("sio_bo.start_new_game")}</h3>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Token</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={Token}
                    label="Token"
                    // onChange={handleChangeToken}
                  >
                    {TokenList.map((item, index) => {
                      return (
                        <MenuItem
                          key={item}
                          selected={index === 0}
                          value={item}
                        >
                          {item}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>

              <TextField
                fullWidth
                aria-readonly
                id="outlined-multiline-static"
                label={t("sio_bo.number")}
                value={startNum}
                onChange={(v) => {
                  setStartNum(v.target.value);
                }}
                multiline
                rows={1}
              />
              <TextField
                fullWidth
                aria-readonly
                id="outlined-multiline-static"
                label={t("sio_bo.amount")}
                value={startAmount}
                onChange={(v) => {
                  setStartAmount(v.target.value);
                }}
                multiline
                rows={1}
              />
            </Stack>
          </CardContent>
          <CardActions>
            <Button variant="contained" fullWidth onClick={createNewGame}>
              {t("sio_bo.start_new_game")}
            </Button>
            <Button variant="contained" fullWidth  onClick={decryptGame}>{t("sio_bo.decrypt_game")}</Button>
          </CardActions>
        </Card>
      </div>
      <div>
        <h3>{t("sio_bo.join_the_game")}</h3>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Box sx={{ minWidth: 120 }}></Box>

              <TextField
                fullWidth
                aria-readonly
                id="outlined-multiline-static"
                label={t("sio_bo.friend_addr")}
                value={friendAddr}
                onChange={(v) => {
                  setFriendAddr(v.target.value);
                }}
                multiline
                rows={1}
              />

              <TextField
                fullWidth
                aria-readonly
                id="outlined-multiline-static"
                label={t("sio_bo.bob_num")}
                value={joinNum}
                onChange={(v) => {
                  setJoinNum(v.target.value);
                }}
                multiline
                rows={1}
              />
            </Stack>
          </CardContent>
          <CardActions>
            <Button variant="contained" fullWidth onClick={joinGameHandler}>
              {t("sio_bo.join_the_game")}
            </Button>
          </CardActions>
        </Card>
      </div>

      <Backdrop
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open={loading}
        >
            <CircularProgress color="inherit" size={160}/>
        </Backdrop>

      <Snackbar 
        open={open} 
        autoHideDuration={6000} 
        onClose={() => setOpen(false)}
        anchorOrigin={{
         vertical: 'top',
         horizontal: 'center',
        }} 
        message={msg}
      />

    </div>
  );
}
