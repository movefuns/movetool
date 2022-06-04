
import { WasmFs } from '@wasmer/wasmfs'
import {MoveTomlTpl} from './tokenTpl/Move.toml'
import {MyTokenSourceTpl} from './tokenTpl/sources/MyToken.move'

export default class TokenPackage {
    private tokenName: string
    private tokenAddress: string
    private tokenPrecision: number

    public constructor(name:string, address: string, precision: number) {
        this.tokenName = name;
        this.tokenAddress = address;
        this.tokenPrecision = precision
    }

    public export(wasmFs: WasmFs, destPath: string) {
        const moveTomlContent = MoveTomlTpl(this.tokenName, this.tokenAddress)
        wasmFs.fs.writeFileSync(destPath + "/Move.toml", moveTomlContent)

        const myTokenContent = MyTokenSourceTpl(this.tokenName, this.tokenPrecision)
        wasmFs.fs.writeFileSync(destPath + "/sources/MyToken.move", myTokenContent)
    }
}