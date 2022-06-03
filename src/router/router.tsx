import * as React from "react";

import Batch from "../pages/Stc/Batch";
import AddressInfo from "../pages/Address/Info";
import {Route, Routes} from "react-router-dom";
import Index from "../pages/Index";
import Gas from "../pages/Stc/Rpc/gas";
import Ping from "../pages/Stc/Rpc/ping";
import UnitConverter from "../pages/Stc/Unit/UnitConverter";
import ChainRecord from "../pages/Chain/Record";
import ChainRecordInfo from "../pages/Chain/RecordInfo";
import Balance from "../pages/Stc/Batch/Balance";
import Transfer from "../pages/Stc/Batch/Transfer";
import Issue from "../pages/Stc/Issue/index";

export default function Router() {
    return (<Routes>
        <Route path="/" element={<Index/>}/>
        <Route path="/address/info" element={<AddressInfo/>}/>
        <Route path="/stc/batch" element={<Batch/>}/>
        <Route path="/stc/batch/transfer" element={<Transfer/>}/>
        <Route path="/stc/batch/balance" element={<Balance/>}/>
        <Route path="/stc/unit/convert" element={<UnitConverter/>}/>
        <Route path="/stc/issue/token" element={<Issue/>}/>
        <Route path="/node/ping" element={<Ping/>}/>
        <Route path="/node/gas" element={<Gas/>}/>
        <Route path="/chain/record" element={<ChainRecord/>}/>
        <Route path="/chain/record/detail" element={<ChainRecordInfo/>}/>
        <Route path="/chain/record/detail/:hash" element={<ChainRecordInfo/>}/>
    </Routes>);
}