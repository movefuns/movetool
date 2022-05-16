import {useMemo, useState} from "react";
import {getNodeInfo} from "../../utils/sdk";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import * as React from "react";
import {useTranslation} from "react-i18next";

type Props = {
    url: string
}

export default function PingItem(props: Props) {
    const {t} = useTranslation();

    const {url} = props;
    const [ping, setPing] = useState<number>(0)
    const [blockHeight, setBlockHeight] = useState<string>("")
    useMemo(async () => {
        const dateStart = new Date();
        const nodeInfo = await getNodeInfo(url)
        const dateEnd = new Date();

        setPing(dateEnd.getTime() - dateStart.getTime())
        setBlockHeight(nodeInfo.peer_info.chain_info.head.number)

    }, [url])

    return <TableRow>
        <TableCell align="center">
            {props.url}
        </TableCell>
        <TableCell align="center">
            {ping > 0 ? `${ping}` + t("rpc_speed.ms") : ""}
        </TableCell>
        <TableCell align="center">
            {blockHeight}
        </TableCell>

        <TableCell align="center">
            {t("rpc_speed.copy")}
        </TableCell>
    </TableRow>
}