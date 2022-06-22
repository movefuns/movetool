import {useState} from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

import {NETWORK} from "../../utils/consts";
import {getLocalNetwork, setLocalNetwork} from "../../utils/localHelper";

export default function NetworkChange() {

    const preNetwork = getLocalNetwork() || "main";
    const [network, setNetwork] = useState(preNetwork);
    const handleChange = (item: any) => {
        setNetwork(item.target.value)
        setLocalNetwork(item.target.value)
    }
    return <>
        <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
            <InputLabel id="demo-simple-select-standard-label">Network</InputLabel>
            <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={network}
                onChange={handleChange}
                label="Network"
            >
                {NETWORK.map((net) => {
                    return <MenuItem key={net} value={net}>{net}</MenuItem>
                })}
            </Select>
        </FormControl>
    </>
}