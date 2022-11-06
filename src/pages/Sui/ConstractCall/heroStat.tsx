import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useWallet } from "@mysten/wallet-adapter-react";
import { JsonRpcProvider } from '@mysten/sui.js';

const provider = new JsonRpcProvider('https://fullnode.devnet.sui.io', {
        // you can also skip providing this field if you don't plan to interact with the faucet
        faucetURL: 'https://faucet.devnet.sui.io',
    });

interface Hero {
    level: number;
    stamina: number;
    HP: number;
    experience: number;
    strength: number;
    defense: number,
    sword: number,
    armor: number,
}

type Props = {
    heroObjectID: string;
    hash: string;
}

export function HeroStat(props: Props) {
    const [ hero, setHero] = useState<Hero|undefined>()
    
    useEffect(() => {
        async function getHeroStat() {
            const txn = await provider.getObject(
                props.heroObjectID
              ) as any;

            const fields = txn.details.data.fields as any

            setHero({
                level: fields.level,
                stamina: fields.stamina,
                HP: fields.hp,
                experience: fields.experience,
                strength: fields.strength,
                defense: fields.defense,
                sword: fields.sword?fields.sword.fields.rarity*fields.sword.fields.strength:0,
                armor: fields.armor?fields.armor.fields.defense*fields.armor.fields.rarity:0,
            });
        }

        getHeroStat();
    }, [props.hash])

    return (
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography gutterBottom variant="h4" component="div">
                Hero State:
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
                level: { hero?.level}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
                stamina: { hero?.stamina}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
                HP: { hero?.HP}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
                experience: { hero?.experience}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
                strength: { hero?.strength}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
                defense: { hero?.defense}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
                sword: { hero?.sword}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
                armor: { hero?.armor}
            </Typography>
          </CardContent>
        </Card>
      );
}
