import { bcs, utils } from "@starcoin/starcoin";
import { hexlify } from "@ethersproject/bytes";
import { sha3_256 } from "js-sha3";
import { getProvder } from "../../utils/stcWalletSdk";
import { NANO_STC, nodeUrlMap } from "../../utils/consts";
import { Buffer } from 'buffer'

const token = "0x00000000000000000000000000000001::STC::STC";
const GameModule = "0xb80660f71e0d5ac2b5d5c43f2246403f::SicBo";

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
  await starcoinProvider
    .getSigner()
    .sendUncheckedTransaction(txParams);
};

export async function aliceStartNewGameWithNum(
  aliceAcoountAddress: string,
  aliceNum: number
) {
  window.console.log({ aliceNum })
  const secretBuf = Buffer.concat(
    [Buffer.from(aliceAcoountAddress.slice(2), "hex"), Buffer.from([aliceNum])],
    17
  );

  const secret = Buffer.from(sha3_256(secretBuf), "hex");

  const amount = 0.1 * NANO_STC;
  const functionId = `${GameModule}::init_game`;
  const tyArgs: any[] = [token];
  const args: any = [secret, amount];
  await sendTx(functionId, tyArgs, args);
}

export async function bobNum(aliceAcoountAddress: String, num: number) {
  window.console.log({ bobNum: num })
  const amount = 0.1 * NANO_STC;
  const functionId = `${GameModule}::bob_what`;
  const tyArgs: any[] = [token];
  const args: any = [aliceAcoountAddress, num, amount];
  await sendTx(functionId, tyArgs, args);
}

export async function aliceNum(num: number) {
  window.console.log({ aliceDecryptNum: num })
  const functionId = `${GameModule}::alice_what`;
  const tyArgs: any[] = [token];
  const args: any = [num];

  await sendTx(functionId, tyArgs, args);
}
