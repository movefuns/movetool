import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {getAddressData, getBalancesData, getAddressSTCBalance,} from "../../../utils/sdk"
import Button from '@mui/material/Button';
import {useTranslation} from "react-i18next";


interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    {id: 'hash', label: 'hash', minWidth: 170},
    {id: 'stc', label: 'STC', minWidth: 100},
    {
        id: 'nanoSTC',
        label: 'nanoSTC',
        minWidth: 170,
        align: 'right',
        format: (value: number) => value.toString(),
    },

];

interface Data {
    hash: string;
    stc: number | null;
    nanoSTC: number | null;
}

function createData(
    hash: string,
    stc: number | null,
    nanoSTC: number | null,
): Data {
    return {hash, stc, nanoSTC};
}

let rows: Data[] = [];

interface Props {
    addressArray: {
        address: string,
        stc: string
    }[]
}

export default function BatchBalance(props: Props) {

    const {addressArray} = props
    const [data, setData] = React.useState<Data[]>([]);
    const {t} = useTranslation();
    const queryStcBalance = async () => {
        const rows: Data[] = [];
        for (const hash of addressArray) {
            const data = await getAddressSTCBalance(hash.address);
            let numStc = null
            let nanoSTC = null

            if (data === undefined) {
                nanoSTC = 0
                numStc = 0
            }
            if (data && data.token) {
                let value = parseInt(data.token.value)
                nanoSTC = value
                numStc = value / 1000000000
            }
            window.console.info(data)
            rows.push(createData(hash.address, numStc, nanoSTC))
        }
        setData(rows)
    }


    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <Button onClick={async () => {
                await queryStcBalance()
            }}>{t("batch_balance.query")}</Button>
            <TableContainer sx={{maxHeight: 440}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{minWidth: column.minWidth}}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.hash}>
                                        {columns.map((column) => {
                                            const id = column.id
                                            const value = row[id]
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
