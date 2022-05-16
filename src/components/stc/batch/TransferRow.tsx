import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import {TextField} from "@mui/material";
import {useState} from "react";
import {NANO_STC} from "../../../utils/consts";

type Props = {
    stc: number
    nanoSTC: number
    onChange: Function,


};


export default function TransferRow(props: Props) {


    const [stc, setStc] = useState(props.stc)
    const [nanoSTC, setNanoSTC] = useState(props.nanoSTC)


    const onChangeSTC = (v: any) => {
        setStc(v.target.value)
        setNanoSTC(v.target.value * NANO_STC)
    }
    const onChangeNanoSTC = (v: any) => {
        setNanoSTC(v.target.value)
        setStc(v.target.value / NANO_STC)
    }

    props.onChange(stc)


    return <>
        <TableCell align="left"> <TextField defaultValue={props.stc} value={stc} onChange={onChangeSTC}
                                            variant="standard"/></TableCell>
        <TableCell align="left"><TextField defaultValue={props.nanoSTC} value={nanoSTC} onChange={onChangeNanoSTC}
                                           variant="standard"/></TableCell>
    </>
}