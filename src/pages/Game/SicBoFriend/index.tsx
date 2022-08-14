import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  Alert,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  Box,
  CardActions,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { aliceStartNewGameWithNum, bobNum, aliceNum } from "../../../games/sicbo_game";
import {getProvder} from "../../../utils/stcWalletSdk";

const Token = "0x00000000000000000000000000000001::STC::STC";
const TokenList = [Token];

export default function SicBoWithFriend() {
  const { t } = useTranslation();
  const [startNum, setStartNum] = useState("1");
  const [startAmount, setStartAmount] = useState("0.1");
  const [joinAmount, setJoinAmount] = useState("0.1");
  const [joinNum, setJoinNum] = useState("1");
  const [friendAddr, setFriendAddr] = useState("");
  const [account, setAccount] = useState<string>();

  React.useEffect(() => {
    getProvder().then(provider => {
      return provider.send("stc_requestAccounts", [])
    }).then(accounts => {
      const account = accounts[0];
      setAccount(account);
    })
  }, [])


  const createNewGame = React.useCallback(async () => {
    if (!account) {
      return;
    }
    await aliceStartNewGameWithNum(account, Number( startNum) || 1)
  }, [account, startNum]);

  const joinGame = React.useCallback(async ()=> {
    if (!account) {
      return;
    }
    await bobNum(friendAddr, Number(joinNum) || 1)
  }, [account, friendAddr, joinNum])

  const decryptGame = React.useCallback(async () => {
    if (!account) {
      return;
    }
    await aliceNum(Number(startNum) || 1)
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
                label={t("sio_bo.amount")}
                value={startNum}
                onChange={(v) => {
                  setStartNum(v.target.value);
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
                label={t("sio_bo.amount")}
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
            <Button variant="contained" fullWidth onClick={joinGame}>
              {t("sio_bo.join_the_game")}
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
}
