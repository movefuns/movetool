import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PingItem from "../../../components/Stc/pingItem";
import {useTranslation} from "react-i18next";

export default function Ping() {
    const { t } = useTranslation();
    const rpcList = [
        "https://main-seed.starcoin.org/",
        "https://proxima-seed.starcoin.org",]

    return (
        <Paper sx={{width: '100%'}}>
            <TableContainer sx={{maxHeight: 440}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">
                                {t("rpc_speed.url")}
                            </TableCell>
                            <TableCell align="center">
                                {t("rpc_speed.delay")}
                            </TableCell>
                            <TableCell align="center">
                                {t("rpc_speed.height")}
                            </TableCell>
                            <TableCell align="center">
                                {t("rpc_speed.actions")}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rpcList.map((v) => <PingItem key={v} url={v}/>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}