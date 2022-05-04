import {FormControl, InputAdornment, InputLabel, TextField} from "@mui/material";
import {Input} from "@mui/icons-material";
import {useState} from "react";
import {NANO_STC} from "../../../utils/consts";

export default function UnitConverter() {
    const [stc,setStc]  =  useState(0)
    const [nanoStc,setNanoStc]  =  useState(0)
    const handleChangeStc = (t:any) => {
        setStc(t.target.value)
        setNanoStc(t.target.value * NANO_STC)
    }

    const handleChangeNanoStc = (t:any) => {
        setNanoStc(t.target.value)
        setStc(t.target.value/NANO_STC)
    }

    return <>
        <FormControl fullWidth sx={{m: 1}} variant="standard">
            <TextField
                value={stc}
                onChange={handleChangeStc}
                label="stc"
            />
        </FormControl>

        <FormControl fullWidth sx={{m: 1}} variant="standard">
            <TextField
                value={nanoStc}
                onChange={handleChangeNanoStc}
                label="nanoStc"
            />
        </FormControl>

    </>
}