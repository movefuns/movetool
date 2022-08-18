import { bcs, utils } from "@starcoin/starcoin";
import { arrayify, hexlify } from "@ethersproject/bytes";
import { sha3_256 } from "js-sha3";
import { getProvder } from "../../utils/stcWalletSdk";
import { NANO_STC, nodeUrlMap } from "../../utils/consts";
import { Buffer } from 'buffer'

const token = "0x00000000000000000000000000000001::STC::STC";
export const GameModule = "0xb80660f71e0d5ac2b5d5c43f2246403f::SicBoV4";

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

export async function aliceStartNewGameWithNum(
  aliceAcoountAddress: string,
  aliceNum: number,
  amountNum: number
) {
  window.console.log({ aliceNum })
  const secretBuf = Buffer.concat(
    [Buffer.from(aliceAcoountAddress.slice(2), "hex"), Buffer.from([aliceNum])],
    17
  );

  const secret = Buffer.from(sha3_256(secretBuf), "hex");

  const amount = amountNum * NANO_STC;
  const functionId = `${GameModule}::init_game`;
  const tyArgs: any[] = [token];
  const args: any = [secret, amount];
  const tx = await sendTx(functionId, tyArgs, args);
  return tx;
}

export async function bobNum(aliceAcoountAddress: String, num: number, amountNum: number) {
  window.console.log({ bobNum: num })
  const amount = amountNum * NANO_STC;
  const functionId = `${GameModule}::bob_what`;
  const tyArgs: any[] = [token];
  const args: any = [aliceAcoountAddress, num, amount];
  const tx = await sendTx(functionId, tyArgs, args);
  return tx;
}

export async function aliceNum(num: number) {
  window.console.log({ aliceDecryptNum: num })
  const functionId = `${GameModule}::alice_what`;
  const tyArgs: any[] = [token];
  const args: any = [num];

  const tx = await sendTx(functionId, tyArgs, args);
  return tx;
}

export function decodeCheckEvent(data: string) {
  const de = new bcs.BcsDeserializer(arrayify(data));
  const aliceNum = de.deserializeU8();
  const bobNum = de.deserializeU8();
  const aliceWin = de.deserializeBool();
  const bobWin = de.deserializeBool();
  return {
    aliceNum,
    bobNum,
    aliceWin,
    bobWin
  };
}