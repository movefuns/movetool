import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
    Backdrop,
    CircularProgress,
    Stack,
    TextField,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";

import {useTranslation} from "react-i18next";
import {useState} from "react";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
function AbiInfo(props:any){
    if(props.abi){
        let newvector: string[]=[];
        props.abi.exposed_functions.forEach((efunc:any) =>{
            let abistr = "";
            abistr += efunc.name;
            abistr += "(";
            efunc.params.forEach((param:string,index:any) =>{
                abistr+= param;
                if(index +1<efunc.params.length){
                    abistr+= ",";
                }
                
            })
            abistr += ")";
            if(efunc.return.length>0){
                abistr +=" ::";
                abistr +=efunc.return;
                abistr +=" "
            }
            newvector.push(abistr);
        })
        const items = newvector.map((line:any) =>
        <Box>
             <ListItem key={`item-${line}`}>
             <ListItemText primary={line}>
             </ListItemText>
             </ListItem>
            </Box>
        )
        return (<>
            <Box sx={{ height: '100%', flexGrow: 1, maxWidth: '100%', overflowY: 'auto' }}>
            <Typography
                sx={{flex: '1 1 100%'}}
                color="inherit"
                variant="subtitle1"
                component="div"
            >address:{props.abi.address} name:{props.abi.name}
                </Typography>

                <List sx={{ width: '100%' }}>
                    {items}
                </List>
            </Box>
            </>);
    }else{
        return (<></>)
    }

}
export default function ABIParser() {
    const {t} = useTranslation();

    const [loading, setLoading] = React.useState(false);
    const [input, setInput] = useState("");
    const [abiobj, setAbiobj] = useState<any>(null);

    const handleCheck = async () => {
        try {
            setLoading(true);
            const obj = JSON.parse(input);
            setAbiobj(obj);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            window.console.error(e);
        }
    };

    return (

        <>
            <Backdrop
                sx={{color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
            >
                <CircularProgress color="inherit" size={160}/>
            </Backdrop>

            <Card>
                <CardContent>
                    Author: <a href="https://github.com/daog1" target="_blank" rel="noreferrer">daog1</a> @ <a href="https://noncegeek.com" target="_blank" rel="noreferrer">NonceGeek</a>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            aria-readonly
                            id="outlined-multiline-static"
                            label={t("aptos.title")}
                            value={input}
                            onChange={(v) => {
                                setInput(v.target.value);
                            }}
                            multiline
                            rows={10}
                        />
                    </Stack>
                </CardContent>
                <CardActions>
                    <Button variant="contained" fullWidth onClick={handleCheck}>
                        {t("aptos.resolve")}
                    </Button>
                </CardActions>
            </Card>
            <Card>
                <CardContent>
                <Stack spacing={2}>
                <AbiInfo abi = {abiobj}></AbiInfo>
                </Stack>
                </CardContent>
                </Card>
                    
        </>
    );
}
