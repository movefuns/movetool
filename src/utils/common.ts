//
import {BatchTransferInput} from "./stcWalletSdk";

export function sleep(duration:number) {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    })
}


export function sliceIntoChunks(arr: BatchTransferInput[], chunkSize: number) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}