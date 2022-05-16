import * as React from "react";

import A from "../pages/A/A";
import B from "../pages/B/B";
import Batch from "../pages/stc/Batch";
import AddressInfo from "../pages/address/Info";
import {Route, Routes} from "react-router-dom";
import Index from "../pages/Index";
import Gas from "../pages/stc/node/gas";
import Ping from "../pages/stc/node/ping";
import UnitConverter from "../pages/stc/Unit/UnitConverter";
import ChainRecord from "../pages/Chain/Record";
import ChainRecordInfo from "../pages/Chain/RecordInfo";
import Balance from "../pages/stc/Batch/Balance";
import Transfer from "../pages/stc/Batch/Transfer";

export default function Router() {
    return (<Routes>
        <Route path="/" element={<Index/>}/>
        <Route path="/a" element={<A/>}/>
        <Route path="/b" element={<B/>}/>
        <Route path="/address/info" element={<AddressInfo/>}/>
        <Route path="/stc/batch" element={<Batch/>}/>
        <Route path="/stc/batch/transfer" element={<Transfer/>}/>
        <Route path="/stc/batch/balance" element={<Balance/>}/>
        <Route path="/stc/unit/convert" element={<UnitConverter/>}/>
        <Route path="/node/ping" element={<Ping/>}/>
        <Route path="/node/gas" element={<Gas/>}/>
        <Route path="/chain/record" element={<ChainRecord/>}/>
        <Route path="/chain/record/detail" element={<ChainRecordInfo/>}/>
        <Route path="/chain/record/detail/:hash" element={<ChainRecordInfo/>}/>
    </Routes>);
}