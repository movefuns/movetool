import * as React from "react";

import Batch from "../pages/Stc/Batch";
import AddressInfo from "../pages/Address/Info";
import { Route, Routes } from "react-router-dom";
import Index from "../pages/Index";
import Gas from "../pages/Stc/Rpc/gas";
import Ping from "../pages/Stc/Rpc/ping";
import UnitConverter from "../pages/Stc/Unit/UnitConverter";
import ChainRecord from "../pages/Chain/Record";
import ChainRecordInfo from "../pages/Chain/RecordInfo";
import Balance from "../pages/Stc/Batch/Balance";
import Transfer from "../pages/Stc/Batch/Transfer";
import TransferConvert from "../pages/Stc/Batch/TransferConvert";
import Issue from "../pages/Stc/Issue/index";

import GameShowdown from "../pages/Game/Showdown";
import GameShowdownAdmin from "../pages/Game/Showdown/ShowdownAdmin";
import FingerGuessingAdmin from "../pages/Game/FingerGuessing/FingerGuessingAdmin";
import SicBoWithFriend from "../pages/Game/SicBoFriend";

import GameFingerGuessing from "../pages/Game/FingerGuessing";
import Donate from "../pages/Donate";

import ConstractDeploy from "../pages/Constract/Deploy/index";
import ContractCall from "../pages/Constract/Call/index";

import ABIParser from "../pages/Aptos/ABIParser";
import MoveU8toString from "../pages/Aptos/MoveU8toString";

export default function Router() {
    return (<Routes>
        <Route path="/" element={<Index />} />
        <Route path="/address/info" element={<AddressInfo />} />
        <Route path="/stc/batch" element={<Batch />} />
        <Route path="/stc/batch/transfer" element={<Transfer />} />
        <Route path="/stc/batch/transfer-convert" element={<TransferConvert />} />
        <Route path="/stc/batch/balance" element={<Balance />} />
        <Route path="/stc/unit/convert" element={<UnitConverter />} />
        <Route path="/stc/issue/token" element={<Issue />} />
        <Route path="/node/ping" element={<Ping />} />
        <Route path="/node/gas" element={<Gas />} />
        <Route path="/chain/record" element={<ChainRecord />} />
        <Route path="/chain/record/detail" element={<ChainRecordInfo />} />
        <Route path="/chain/record/detail/:hash" element={<ChainRecordInfo />} />

        <Route path="/game/showdown" element={<GameShowdown />} />
        <Route path="/game/showdown/admin" element={<GameShowdownAdmin />} />
        <Route path="/game/finger_guessing" element={<GameFingerGuessing />} />
        <Route path="/game/finger_guessing/admin" element={<FingerGuessingAdmin />} />
        <Route path="/game/sicbo_friend" element={<SicBoWithFriend />} />

        <Route path="/donate" element={<Donate />} />
        <Route path="/donate/:address/:amount" element={<Donate />} />

        <Route path="/constract/deploy" element={<ConstractDeploy />} />
        <Route path="/contract/call" element={<ContractCall />} />

        <Route path="/aptos/abi_parser" element={<ABIParser />} />
        <Route path="/aptos/debug_string" element={<MoveU8toString />} />

    </Routes>);
}