import Card from '@mui/material/Card';
import CardContent from "@mui/material/CardContent";
import * as React from "react";
import {Stack, TextField} from "@mui/material";
import {useMemo, useState} from "react";
import {getBlockByNumber, getTxnData} from "../../utils/sdk";
import {bcs, encoding} from "@starcoin/starcoin";
import {arrayify} from "@ethersproject/bytes";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";

export default function ChainRecordInfo() {
    let { hash } = useParams();
    const { t } = useTranslation();
    let [tx,setTx] =  useState(hash || "")

   // const hash = "0x40ca660cc50bd38c2d68b17f5fd8db6d062397f138e912e21f0fb97770dbbaf5"
    const [content, setContent] = useState("")
    const [timestamp, setTimestamp] = useState("")
    useMemo(async () => {
        setContent("");
        setTimestamp("");
        const data = await getTxnData(tx as  string)
        const txnPayload = encoding.decodeTransactionPayload(data.user_transaction.raw_txn.payload);

        window.console.info(data)
        const content = ((txnPayload as any).ScriptFunction).args[2];
        const se = new bcs.BcsDeserializer(arrayify(content))
        const src = se.deserializeStr()
        setContent(src)

        const blockInfo = await getBlockByNumber(data.block_hash);

        setTimestamp((new Date(Number(blockInfo.header.timestamp))).toLocaleString())

    }, [tx])

    return <>
        <Card>


            <CardContent>
                <Stack spacing={2}>



                    <TextField
                        fullWidth
                        id="outlined-multiline-static"
                        label={t("chain_record.record_tx")}
                        value={tx}
                        onChange={(v)=>{
                            setTx(v.target.value)
                        }}

                        multiline
                        rows={1}/>

                    <>   {t("chain_record.record_time")}: {timestamp}</>


                    <TextField
                        fullWidth
                        aria-readonly
                        id="outlined-multiline-static"
                        label={t("chain_record.content")}
                        value={content}

                        multiline
                        rows={8}/>

                </Stack>

            </CardContent>
        </Card>
    </>
}