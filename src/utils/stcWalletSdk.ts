import {providers, utils, bcs, encoding} from "@starcoin/starcoin"
import {hexlify} from '@ethersproject/bytes'
import {BigNumber} from "bignumber.js"

const nodeUrlMap = {
    '1': 'https://main-seed.starcoin.org',
    '2': 'https://proxima-seed.starcoin.org',
    '251': 'https://barnard-seed.starcoin.org',
    '253': 'https://halley-seed.starcoin.org',
    '254': 'http://localhost:9850',
}


export async function requestAccounts() {
    const newAccounts = await window.starcoin.request({
        method: 'stc_requestAccounts',
    })
    return newAccounts
}

export async function getProvder() {
    const provider = new providers.Web3Provider(window.starcoin, 'any')
    return provider;
}


export async function transfer(account: string, stcAmount: number, content: string) {
    window.console.log('sendButton.onclick')

    const toAccount = account
    if (!toAccount) {
        // eslint-disable-next-line no-alert
        window.alert('Invalid To: can not be empty!')
        return false
    }

    const sendAmount = stcAmount
    if (!(sendAmount > 0)) {
        // eslint-disable-next-line no-alert
        window.alert('Invalid sendAmount: should be a number!')
        return false
    }
    const BIG_NUMBER_NANO_STC_MULTIPLIER = new BigNumber('1000000000')
    const sendAmountSTC = new BigNumber(sendAmount)
    const sendAmountNanoSTC = sendAmountSTC.times(BIG_NUMBER_NANO_STC_MULTIPLIER)
    const sendAmountHex = `0x${sendAmountNanoSTC.toString(16)}`
    window.console.log({sendAmountHex, sendAmountNanoSTC: sendAmountNanoSTC.toString(10)})

    const txParams = {
        to: toAccount,
        value: sendAmountHex,
        data: content,
        gasLimit: 127845,
        gasPrice: 1,
        expiredSecs: 10
    }

    const expiredSecs = 10
    window.console.log({expiredSecs})
    if (expiredSecs > 0) {
        txParams.expiredSecs = expiredSecs
    }

    window.console.log({txParams})
    const starcoinProvider = await getProvder();
    const transactionHash = await starcoinProvider.getSigner().sendUncheckedTransaction(txParams)
    window.console.log(transactionHash)
}


export async function batchTransfer_v2(input: BatchTransferInput[]) {


    const toAddress: string[] = []
    const toAmount: any = []
    input.forEach((item) => {
        toAddress.push(item.account)
        toAmount.push(Number(amount(item.amount)))
    })

    try {
        const functionId = '0x1::TransferScripts::batch_peer_to_peer_v2'
        const tyArgs = ['0x1::STC::STC']
        const args = [
            toAddress,
            toAmount
        ]
        const nodeUrl = nodeUrlMap[window.starcoin.networkVersion]
        window.console.info(functionId, tyArgs, args, nodeUrl)
        const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(functionId, tyArgs, args, nodeUrl)
        window.console.log(scriptFunction)


        // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
        const payloadInHex = (function () {
            const se = new bcs.BcsSerializer()
            scriptFunction.serialize(se)
            return hexlify(se.getBytes())
        })()


        const txParams = {
            data: payloadInHex,

        }

        const expiredSecs = 10
        window.console.log({expiredSecs})
        if (expiredSecs > 0) {
            //  txParams.expiredSecs = expiredSecs
        }

        const starcoinProvider = await getProvder();
        const transactionHash = await starcoinProvider.getSigner().sendUncheckedTransaction(txParams)
        window.console.log({transactionHash})
    } catch (error) {

        throw error
    }


}


export interface BatchTransferInput {
    account: string
    amount: number
}

export async function peerTransfer_with_metadata_v2(account: string, stcAmount: number, content: string) {

    try {
        const functionId = '0x1::TransferScripts::peer_to_peer_with_metadata_v2'
        const tyArgs = ['0x1::STC::STC']
        const args = [
            account,
            stcAmount,
            content
        ]
        const nodeUrl = nodeUrlMap[window.starcoin.networkVersion]
        const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(functionId, tyArgs, args, nodeUrl)
        // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
        const payloadInHex = (function () {
            const se = new bcs.BcsSerializer()
            scriptFunction.serialize(se)
            return hexlify(se.getBytes())
        })()
        const txParams = {
            data: payloadInHex,
            expiredSecs: 10
        }

        const starcoinProvider = await getProvder();
        const transactionHash = await starcoinProvider.getSigner().sendUncheckedTransaction(txParams)
        return transactionHash
    } catch (error) {

        throw error
    }


}


function amount(sendAmount: number) {
    if (!(sendAmount > 0)) {
        // eslint-disable-next-line no-alert
        window.alert('Invalid sendAmount: should be a number!')
        return false
    }
    const BIG_NUMBER_NANO_STC_MULTIPLIER = new BigNumber('1000000000')
    const sendAmountSTC = new BigNumber(sendAmount, 10)
    const sendAmountNanoSTC = sendAmountSTC.times(BIG_NUMBER_NANO_STC_MULTIPLIER)
    return sendAmountNanoSTC;
}


export async function deployContract(code:Buffer):Promise<string> {
    let transactionHash
 
    const packageHex = hexlify(code)
    if (!packageHex.length) {
        alert('Contract blob hex is empty')
    }

    const transactionPayloadHex = encoding.packageHexToTransactionPayloadHex(packageHex)
    const starcoinProvider = await getProvder();
    transactionHash = await starcoinProvider.getSigner().sendUncheckedTransaction({data: transactionPayloadHex})

    return transactionHash
}