import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { Ed25519Keypair, JsonRpcProvider, RawSigner } from '@mysten/sui.js';

const keypair = Ed25519Keypair.deriveKeypair("satoshi border lady photo income play mom lawn alter solar habit butter")
const provider = new JsonRpcProvider();
const signer = new RawSigner(keypair, provider);

type Props = {
  gameObjectID: string
  heroObjectID: string;
  monsterName: string;
  onFightSuccess: (hash: string) => void;
}

export function AutoFight(props: Props) {
    const [address, setAddress] = useState<string>("")
    const [ fightHash, setFightHash] = useState<string>("")
    const [ fighting, setFighting] = useState<boolean>(false)
    const [ fightLogs, setFightLogs] = useState<Array<string>>(new Array<string>())

    const onStartFight = async () => {
      setFightLogs(new Array<string>())
      setFighting(true)
      setFightHash(new Date().getTime().toString())
    };

    const onStopFight = async () => {
      setFighting(false)
    };

    const logFight = function(log:string) {
      const logs = fightLogs;
      logs.push(log)
      setFightLogs(logs)
    }

    const slayMonster = async (gameObjectId: string, heroObjectID:string, monsterName: string) => {
      logFight("Slaying Boar...")

      try {
        const moveCallTxn = await signer.executeMoveCallWithRequestType({
          packageObjectId: gameObjectId,
          module: 'adventure',
          function: 'slay_' + monsterName,
          typeArguments: [],
          arguments: [
            heroObjectID,
          ],
          gasBudget: 10000,
        }) as any;
  
        logFight('Slaying ' + monsterName + ' success, hash:' + moveCallTxn.EffectsCert.certificate.transactionDigest);
      
        if (props.onFightSuccess) {
          props.onFightSuccess(moveCallTxn.EffectsCert.certificate.transactionDigest)
        }

        setFightHash(new Date().getTime().toString())
      } catch(e:any) {
        logFight('Slaying ' + monsterName + ' fail, err:' + e.message);
        setFightHash(new Date().getTime().toString())
      }
    }

    useEffect(() => {
      async function initRobot() {
        logFight("init robot...")
        const address = await signer.getAddress()
        setAddress(address)
      }

      initRobot()
    }, [props])

    useEffect(() => {
      async function fight() {
        await slayMonster(props.gameObjectID, props.heroObjectID, props.monsterName)
      }

      if (props.gameObjectID && props.heroObjectID && fighting) {
        fight()
      } else {
        logFight("waiting...")
      }
    }, [props, fightHash])

    useEffect(() => {
      async function queryTreasuryBox() {
        const objects = await provider.getObjectsOwnedByAddress(
          address
        ) as any;

        for (let i = 0; i < objects.length; i++) {
          const obj = objects[i]
          if (obj.type.includes('TreasuryBox')) {
            logFight("found TreasuryBox:")
            alert("found TreasuryBox:" + obj.objectId)
            setFighting(false)
            break
          }
        }
      }

      queryTreasuryBox();
    }, [props, fightHash])


    return (
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Fight robot: {address}
            </Typography>
            <CardActions>
              <Button size="small" onClick={onStartFight}>Start Fight</Button>
              <Button size="small" onClick={onStopFight}>Stop Fight</Button>
            </CardActions>

            <List>
              {fighting ? (
                Object.keys(fightLogs).length > 0 ? (
                  Object.values(fightLogs)
                    .map((log, index) => (
                      <ListItem key={index} disablePadding>
                        { log }
                      </ListItem>
                    ))
                ) : (
                  <ListItem disablePadding>
                    No fight logs
                  </ListItem>
                )
              ) : (
                <ListItem disablePadding>
                  Fighting not start
                </ListItem>
              )}
            </List>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={onStartFight}>Start Fight</Button>
            <Button size="small" onClick={onStopFight}>Stop Fight</Button>
          </CardActions>
        </Card>
      );
}
