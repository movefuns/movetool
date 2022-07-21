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


export function isTokenName(name: string) {
    return /^[A-Z][a-zA-Z0-9_]*/.test(name)
}

export function firstToUpper(str:string){
    return str.toLowerCase().replace(/( |^)[a-z]/g,(L)=>L.toUpperCase());
}