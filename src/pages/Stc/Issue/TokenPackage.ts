
import { WasmFs } from '@wasmer/wasmfs'
import {MoveTomlTpl} from './Template/MyToken/Move.toml'
import {MyTokenSourceTpl} from './Template/MyToken/sources/MyToken.move'

class TokenPackage {
    private wasmfs: WasmFs
    private tokenAddress: string
    private tokenName: string
    private tokenPrecision: number

    public constructor(wasmfs: WasmFs, address: string, name:string,  precision: number) {
        this.wasmfs = wasmfs;
        this.tokenAddress = address;
        this.tokenName = name;
        this.tokenPrecision = precision
    }

    public export(destPath: string) {
        this.wasmfs.fs.mkdirpSync(destPath)

        window.console.info("Token Address: " + this.tokenAddress + "::" + this.tokenName + "::" + this.tokenName)

        const moveTomlPath = destPath + "/Move.toml"
        const moveTomlContent = MoveTomlTpl(this.tokenName, this.tokenAddress)
        this.wasmfs.fs.writeFileSync(moveTomlPath, moveTomlContent)
        window.console.info(moveTomlPath)
        window.console.info(moveTomlContent)
        window.console.info()

        const sourcesDir = destPath + "/sources";
        this.wasmfs.fs.mkdirpSync(sourcesDir)
        const myTokenPath = sourcesDir + "/MyToken.move"
        const myTokenContent = MyTokenSourceTpl(this.tokenName, this.tokenPrecision)
        this.wasmfs.fs.writeFileSync(myTokenPath, myTokenContent)
        window.console.info(myTokenPath)
        window.console.info(myTokenContent)
        window.console.info()
    }
}


export { TokenPackage }