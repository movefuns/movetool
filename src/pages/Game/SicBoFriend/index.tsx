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
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { aliceStartNewGameWithNum, bobNum, aliceNum, GameModule, decodeCheckEvent } from "../../../games/sicbo_game";
import {getProvder} from "../../../utils/stcWalletSdk";
import { getEventsByTxnHash, getTxnData } from "../../../utils/sdk";
import { sleep } from "../../../utils/common";

const Token = "0x00000000000000000000000000000001::STC::STC";
const TokenList = [Token];

export default function SicBoWithFriend() {
  const { t } = useTranslation();
  const [startAmount, setStartAmount] = useState('0.1')
  const [startNum, setStartNum] = useState("1");
  const [joinAmount, setJoinAmount] = useState('0.1')
  const [joinNum, setJoinNum] = useState("1");
  const [friendAddr, setFriendAddr] = useState("");
  const [account, setAccount] = useState<string>();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('')

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
    const rs = await aliceStartNewGameWithNum(account, Number( startNum) || 1, Number(startAmount))
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
            event.type_tag === `${GameModule}::GameEvent`
        ) {
            const checkEvent = decodeCheckEvent(event.data);
            window.console.log('create',checkEvent)
            toastMsg(t('sio_bo.create_game_success'))
        }
      }
    }
  }, [account, startNum, startAmount, t]);

  const joinGame = React.useCallback(async ()=> {
    if (!account) {
      return;
    }
    const rs = await bobNum(friendAddr, Number(joinNum) || 1, Number(joinAmount))
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
            event.type_tag === `${GameModule}::GameEvent`
        ) {
            const checkEvent = decodeCheckEvent(event.data);
            window.console.log('joinGame',checkEvent)
            toastMsg(t('sio_bo.join_game_success'))
        }
      }
    }
  }, [account, friendAddr, joinNum, joinAmount, t])

  const decryptGame = React.useCallback(async () => {
    if (!account) {
      return;
    }
    const rs = await aliceNum(Number(startNum) || 1)
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
            event.type_tag === `${GameModule}::GameEvent`
        ) {
            const checkEvent = decodeCheckEvent(event.data);
            window.console.log('decryptGame',checkEvent)
        }
      }
    }
  }, [account, startNum])

  return (
    <div>
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
                label={t("sio_bo.number")}
                value={joinNum}
                onChange={(v) => {
                  setJoinNum(v.target.value);
                }}
                multiline
                rows={1}
              />
              <TextField
                fullWidth
                aria-readonly
                id="outlined-multiline-static"
                label={t("sio_bo.amount")}
                value={joinAmount}
                onChange={(v) => {
                  setJoinAmount(v.target.value);
                }}
                multiline
                rows={1}
              />
            </Stack>
          </CardContent>
          <CardActions>
            <Button variant="contained" fullWidth onClick={joinGame}>
              {t("sio_bo.join_the_game")}
            </Button>
          </CardActions>
        </Card>
      </div>

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
