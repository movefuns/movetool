import * as React from 'react';
import {alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import {visuallyHidden} from '@mui/utils';
import Button from "@mui/material/Button";

import {NANO_STC} from "../../../utils/consts";
import {batchTransfer_v2} from "../../../utils/stcWalletSdk";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

import Divider from "@mui/material/Divider";
import useSWR from "swr"

interface Data {
    tokenAmount: number;
    address: string;
    nanoToken: number;
}

function createData(
    address: string,
    tokenAmount: number,
    nanoToken: number,
): Data {
    return {
        address,
        tokenAmount,
        nanoToken
    };
}


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'address',
        numeric: false,
        disablePadding: true,
        label: 'address',
    },
    {
        id: 'tokenAmount',
        numeric: true,
        disablePadding: false,
        label: 'Token amount',
    },
    {
        id: 'nanoToken',
        numeric: true,
        disablePadding: false,
        label: 'nano Token',
    },
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const {order, orderBy, onRequestSort} =
        props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>

                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align="center"
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    totalToken: number;
    totalInput: string;
    type: string;

    handleTransferClick(): any;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const {numSelected, totalToken, handleTransferClick, totalInput, type} = props;
    const {t} = useTranslation();
    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >

            <Typography
                sx={{flex: '1 1 100%'}}
                color="inherit"
                variant="subtitle1"
                component="div"
            >
                total address: {numSelected}, total Input Amount: {totalInput} {type} ,total Send Token {totalToken}
            </Typography>

            <Button variant="contained" onClick={handleTransferClick}>{t("batch_token.send")}</Button>


        </Toolbar>
    );
};


interface Props {
    addressArray: {
        address: string,
        stc: string
    }[]
}


export default function ConvertBatchTransfer(props: Props) {
    const {addressArray} = props;
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('nanoToken');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page] = React.useState(0);
    const [dense] = React.useState(true);
    const [rowsPerPage] = React.useState(5);
    const [token, setToken] = useState("0x00000000000000000000000000000001::STC::STC")
    const [tokenList] = useState<string[]>(["0x00000000000000000000000000000001::STC::STC"])
    const [input, setInput] = useState("USDT")
    const [inputList] = useState<string[]>(["USDT"])


    const {data}  =   useSWR("https://price-api.starcoin.org/main/v1/priceFeeds/STCUSD",   async url=>{
       return await fetch(url).then(r => r.json())
    })
    let lastPrice = 0
    let lastInputPrice = 0
    if (data){
        lastPrice = data.latestPrice/ (10**data.decimals)
        lastInputPrice = lastPrice > 0 ? parseFloat((1/lastPrice).toFixed(data.decimals)) :0
    }


    const rows: Data[] = [];
    addressArray.forEach((item) => {
        rows.push(createData(item.address, parseFloat(item.stc)*lastInputPrice,  parseInt(String(parseFloat(item.stc) * lastInputPrice * NANO_STC))));
    })


    let totalToken;
    const computeTotalToken = () => {
        let totalToken = 0;
        rows.forEach(v => {
            totalToken += v.tokenAmount
        })
        return totalToken;
    }
    totalToken = computeTotalToken();



    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.address);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };


    async function handleTransferClick() {


        if (!rows || rows.length < 1) {
            alert("please input address and amount")
        }

        try {
            await batchTransfer_v2(rows.map(v => {
                return {
                    account: v.address,
                    amount: v.tokenAmount
                }
            }), token)
        } catch (e: any) {

            if (e.toString().includes("UNSUPPORTED_OPERATION")) {
                alert("please login")
            } else {
                alert(e)
            }


        }

    }


    const handleChangeToken = (event: SelectChangeEvent) => {
        setToken(event.target.value as string);
    };

    const handleChangeInput = (event: SelectChangeEvent) => {
        setInput(event.target.value as string);
    };


    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box sx={{width: '100%'}}>
            <Paper sx={{width: '100%', mb: 2}}>


                <Box sx={{minWidth: 120}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Input Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={input}
                            label="Input Type"
                            onChange={handleChangeInput}
                        >
                            {inputList.map((item, index) => {
                                return <MenuItem key={item} selected={index === 0} value={item}>{item}</MenuItem>
                            })}

                        </Select>
                    </FormControl>
                </Box>

                <br/>
                <Divider>1 USDT = {lastPrice > 0? (1/lastPrice).toFixed(6) : 0} STC , 1 STC = {lastPrice} USDT</Divider>
                <br/>
                <Box sx={{minWidth: 120}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Transfer Token</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={token}
                            label="Transfer"
                            onChange={handleChangeToken}
                        >
                            {tokenList.map((item, index) => {
                                return <MenuItem key={item} selected={index === 0} value={item}>{item}</MenuItem>
                            })}

                        </Select>
                    </FormControl>
                </Box>

                <EnhancedTableToolbar numSelected={rows.length} totalToken={totalToken} totalInput={(totalToken*lastPrice).toFixed(2)}
                                      type={input}
                                      handleTransferClick={handleTransferClick}/>
                <TableContainer>
                    <Table
                        sx={{minWidth: 750}}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
                            {stableSort(rows, getComparator(order, orderBy))
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.address);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.address)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.address + row.tokenAmount}
                                            selected={isItemSelected}
                                        >
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                align="center"
                                                padding="none"
                                            >
                                                {row.address}
                                            </TableCell>

                                            <TableCell align="center"> {row.tokenAmount}</TableCell>
                                            <TableCell align="center"> {row.nanoToken}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}


                        </TableBody>


                    </Table>
                </TableContainer>
            </Paper>


        </Box>
    );
}
