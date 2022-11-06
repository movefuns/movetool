import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { Ed25519Keypair, JsonRpcProvider, RawSigner } from '@mysten/sui.js';

type Props = {
  mnemonics: string;
  gameObjectID: string;
  heroObjectID: string;
  onFightSuccess: (hash: string) => void;
}

export function AutoFight(props: Props) {
    const [address, setAddress] = useState<string>("")
    const [treasuryBoxObjectID, setTreasuryBoxObjectID] = useState<string>("")
    const [monsterName, setMonsterName] = useState<string>("boar")

    const [ fightHash, setFightHash] = useState<string>("")
    const [ fighting, setFighting] = useState<boolean>(false)
    const [ fightLogs, setFightLogs] = useState<Array<string>>(new Array<string>())

    const keypair = Ed25519Keypair.deriveKeypair(props.mnemonics)
    const provider = new JsonRpcProvider();
    const signer = new RawSigner(keypair, provider);

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

    const onLevelUp = async () => {
      logFight("Get Flag...")

      const gameObjectId = props.gameObjectID;
      const heroObjectID = props.heroObjectID;

      try {
        setFighting(false)
 
        const moveCallTxn = await signer.executeMoveCallWithRequestType({
          packageObjectId: gameObjectId,
          module: 'hero',
          function: 'level_up',
          typeArguments: [],
          arguments: [
            heroObjectID,
          ],
          gasBudget: 10000,
        }) as any;
  
        logFight('Hero level up success, hash:' + moveCallTxn.EffectsCert.certificate.transactionDigest);
      
        if (props.onFightSuccess) {
          props.onFightSuccess(moveCallTxn.EffectsCert.certificate.transactionDigest)
        }

        setFightLogs(new Array<string>())
        setFighting(true)
        setMonsterName("boar_king")
        setFightHash(new Date().getTime().toString())
      } catch(e:any) {
        setFighting(false)
        setFightLogs(new Array<string>())
        logFight('Hero level up fail, err:' + e.message);

        // 5s后重试
        setTimeout(function() {
          setFightLogs(new Array<string>())
          setFighting(true)
          setMonsterName("boar_king")
          setFightHash(new Date().getTime().toString())
        }, 5000)
      }
    };

    const onGetFlag = async () => {
      logFight("Get Flag...")

      const gameObjectId = props.gameObjectID;

      try {
        setFighting(false)

        const moveCallTxn = await signer.executeMoveCallWithRequestType({
          packageObjectId: gameObjectId,
          module: 'inventory',
          function: 'get_flag',
          typeArguments: [],
          arguments: [
            treasuryBoxObjectID,
          ],
          gasBudget: 10000,
        }) as any;
  
        logFight('Call get flag success, hash:' + moveCallTxn.EffectsCert.certificate.transactionDigest);
      
        if (props.onFightSuccess) {
          props.onFightSuccess(moveCallTxn.EffectsCert.certificate.transactionDigest)
        }

        setFightHash(new Date().getTime().toString())
        alert('Call get flag success, hash:' + moveCallTxn.EffectsCert.certificate.transactionDigest)
      } catch(e:any) {
        logFight('Call get flag fail, err:' + e.message);
        setFightHash(new Date().getTime().toString())
      }
    };

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
        await slayMonster(props.gameObjectID, props.heroObjectID, monsterName)
      }

      if (props.gameObjectID && props.heroObjectID && fighting) {
        fight()
      } else {
        logFight("waiting...")
      }
    }, [props, fightHash])

    useEffect(() => {
      async function queryHeroStat() {
        const txn = await provider.getObject(
          props.heroObjectID
        ) as any;

        const fields = txn.details.data.fields as any

        if (fields.level === 1 && fields.experience >=100) {
          setFighting(false)
          logFight("Has 100 experience, stop fighting")
          await onLevelUp()
        }

        if (fields.stamina === 0) {
          setFighting(false)
          logFight("stamina empty, stop fighting")
        }
      }

      queryHeroStat();
    }, [props, fightHash])

    useEffect(() => {
      async function queryTreasuryBox() {
        const objects = await provider.getObjectsOwnedByAddress(
          address
        ) as any;

        for (let i = 0; i < objects.length; i++) {
          const obj = objects[i]
          if (obj.type.includes('TreasuryBox')) {
            setTreasuryBoxObjectID(obj.objectId)
            setFighting(false)
            logFight("found TreasuryBox")
            await onGetFlag()
            break
          }
        }
      }

      if (address !== "") {
        queryTreasuryBox();
      }
    }, [props, address, fightHash])


    return (
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Fight {monsterName} robot: {address}
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
              treasuryBoxObjectID: {treasuryBoxObjectID}
            </Typography>
            <CardActions>
              <Button size="small" onClick={onStartFight}>Start Fight</Button>
              <Button size="small" onClick={onStopFight}>Stop Fight</Button>
              <Button size="small" onClick={onLevelUp}>Level up</Button>
              <Button size="small" onClick={onGetFlag}>Get Flag</Button>
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
            <Button size="small" onClick={onLevelUp}>Level up</Button>
            <Button size="small" onClick={onGetFlag}>Get Flag</Button>
          </CardActions>
        </Card>
      );
}
