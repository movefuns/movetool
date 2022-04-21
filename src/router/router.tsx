import * as React from "react";

import A from "../pages/A/A";
import B from "../pages/B/B";
import Batch from "../pages/stc/Batch";
import AddressInfo from "../pages/address/Info";
import {Route, Routes} from "react-router-dom";
import Index from "../pages/Index";


export default function Router() {
    return (<Routes>
        <Route path="/" element={<Index/>}/>
        <Route path="/a" element={<A/>}/>
        <Route path="/b" element={<B/>}/>
        <Route path="/address/info" element={<AddressInfo/>}/>
        <Route path="/stc/batch" element={<Batch/>}/>
    </Routes>);
}