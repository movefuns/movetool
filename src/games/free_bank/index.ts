import {bcs, utils} from "@starcoin/starcoin";
import { hexlify} from "@ethersproject/bytes";
import {getProvder} from "../../utils/stcWalletSdk";
import { nodeUrlMap} from "../../utils/consts";

const ADMIN_ADDRESS = "0x68d69dc32ae00470c8c96793a5c9b560"
export async function initBank() {
    try {
        const functionId = `${ADMIN_ADDRESS}::FreeBank::init`;
        const nodeUrl = nodeUrlMap[window.starcoin.networkVersion];
        const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(
            functionId,
            [],
            [],
            nodeUrl
        );

        // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
        const payloadInHex = (function () {
            const se = new bcs.BcsSerializer();
            scriptFunction.serialize(se);
            return hexlify(se.getBytes());
        })();

        const txParams = {
            data: payloadInHex,
        };

        const expiredSecs = 10;
        if (expiredSecs > 0) {
            //  txParams.expiredSecs = expiredSecs
        }

        const starcoinProvider = await getProvder();
        const transactionHash = await starcoinProvider
            .getSigner()
            .sendUncheckedTransaction(txParams);
        window.console.log({transactionHash});
    } catch (e) {
        window.console.error(e);
    }
}

export async function extract() {
    try {
        const functionId = `${ADMIN_ADDRESS}::FreeBank::extract`;
        const nodeUrl = nodeUrlMap[window.starcoin.networkVersion];
        const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(
            functionId,
            [],
            [],
            nodeUrl
        );

        // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
        const payloadInHex = (function () {
            const se = new bcs.BcsSerializer();
            scriptFunction.serialize(se);
            return hexlify(se.getBytes());
        })();

        const txParams = {
            data: payloadInHex,
        };

        const expiredSecs = 10;
        if (expiredSecs > 0) {
            //  txParams.expiredSecs = expiredSecs
        }

        const starcoinProvider = await getProvder();
        const transactionHash = await starcoinProvider
            .getSigner()
            .sendUncheckedTransaction(txParams);
        window.console.log({transactionHash});
    } catch (e) {
        window.console.error(e);
    }
}


export async function restore() {
    try {
        const functionId = `${ADMIN_ADDRESS}::FreeBank::restore`;
        const nodeUrl = nodeUrlMap[window.starcoin.networkVersion];
        const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(
            functionId,
            [],
            [],
            nodeUrl
        );

        // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
        const payloadInHex = (function () {
            const se = new bcs.BcsSerializer();
            scriptFunction.serialize(se);
            return hexlify(se.getBytes());
        })();

        const txParams = {
            data: payloadInHex,
        };

        const expiredSecs = 10;
        if (expiredSecs > 0) {
            //  txParams.expiredSecs = expiredSecs
        }

        const starcoinProvider = await getProvder();
        const transactionHash = await starcoinProvider
            .getSigner()
            .sendUncheckedTransaction(txParams);
        window.console.log({transactionHash});
    } catch (e) {
        window.console.error(e);
    }
}


export async function deposit(amount: number) {
    try {
        const functionId = `${ADMIN_ADDRESS}::FreeBank::deposit`;

        const args = [amount];
        const nodeUrl = nodeUrlMap[window.starcoin.networkVersion];
        const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(
            functionId,
            [],
            args,
            nodeUrl
        );

        // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
        const payloadInHex = (function () {
            const se = new bcs.BcsSerializer();
            scriptFunction.serialize(se);
            return hexlify(se.getBytes());
        })();

        const txParams = {
            data: payloadInHex,
        };

        const expiredSecs = 10;
        if (expiredSecs > 0) {
            //  txParams.expiredSecs = expiredSecs
        }

        const starcoinProvider = await getProvder();
        const transactionHash = await starcoinProvider
            .getSigner()
            .sendUncheckedTransaction(txParams);
        window.console.log({transactionHash});
    } catch (e) {
        window.console.error(e);
    }
}

export async function withdraw(amount: number) {
    try {
        const functionId = `${ADMIN_ADDRESS}::FreeBank::withdraw`;
        const args = [amount];
        const nodeUrl = nodeUrlMap[window.starcoin.networkVersion];
        const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(
            functionId,
            [],
            args,
            nodeUrl
        );

        // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
        const payloadInHex = (function () {
            const se = new bcs.BcsSerializer();
            scriptFunction.serialize(se);
            return hexlify(se.getBytes());
        })();

        const txParams = {
            data: payloadInHex,
        };

        const expiredSecs = 10;
        if (expiredSecs > 0) {
            //  txParams.expiredSecs = expiredSecs
        }

        const starcoinProvider = await getProvder();
        const transactionHash = await starcoinProvider
            .getSigner()
            .sendUncheckedTransaction(txParams);
        window.console.log({transactionHash});
    } catch (e) {
        window.console.error(e);
    }
}
