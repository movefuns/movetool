import { bcs, utils , starcoin_types} from "@starcoin/starcoin";

import { arrayify, hexlify } from "@ethersproject/bytes";
import { sha3_256 } from "js-sha3";
import { getProvder } from "../../utils/stcWalletSdk";
import { NANO_STC, nodeUrlMap } from "../../utils/consts";
import { Buffer } from 'buffer'
import {ADMIN_ADDRESS} from "../index";

const { AccountAddress } =starcoin_types;
const token = "0x00000000000000000000000000000001::STC::STC";
export const GameModule = `${ADMIN_ADDRESS}::SicBoV9`;

const sendTx = async (functionId: string, tyArgs: any[], args: any[]) => {
  const nodeUrl = nodeUrlMap[window.starcoin.networkVersion];
  const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(
    functionId,
    tyArgs,
    args,
    nodeUrl
  );

  const payloadInHex = (function () {
    const se = new bcs.BcsSerializer();
    scriptFunction.serialize(se);
    return hexlify(se.getBytes());
  })();

  const txParams = {
    data: payloadInHex,
  };
  const starcoinProvider = await getProvder();
  const tx = await starcoinProvider
    .getSigner()
    .sendUncheckedTransaction(txParams);
  return tx;
};

export async function startNewGameWithNum(
  accountAddress: string,
  num: number,
  amountNum: number
) {
  const secretBuf = Buffer.concat(
    [Buffer.from(accountAddress.slice(2), "hex"), Buffer.from([num])],
    17
  );

  const secret = Buffer.from(sha3_256(secretBuf), "hex");

  const amount = amountNum * NANO_STC;
  const functionId = `${GameModule}::start_game`;
  const tyArgs: any[] = [token];
  const args: any = [secret, amount];
  const tx = await sendTx(functionId, tyArgs, args);
  return tx;
}

export async function joinGame(accountAddress: String, num: number) {
  const functionId = `${GameModule}::join_game`;
  const tyArgs: any[] = [token];
  const args: any = [accountAddress, num];
  const tx = await sendTx(functionId, tyArgs, args);
  return tx;
}

export async function endGame(num: number) {
  const functionId = `${GameModule}::end_game`;
  const tyArgs: any[] = [token];
  const args: any = [num];

  const tx = await sendTx(functionId, tyArgs, args);
  return tx;
}

export function decodeGameEvent(data: string) {
  const de = new bcs.BcsDeserializer(arrayify(data));
  const addr = AccountAddress.deserialize(de);
  return {
    addr: "0x" + Buffer.from(addr.value.map((item) => item[0])).toString("hex"),
  };
}