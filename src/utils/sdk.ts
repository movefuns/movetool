// https://www.npmjs.com/package/@starcoin/starcoin
import {providers} from '@starcoin/starcoin';


function getNetwork() {
    return "main"
}

const networks: string[] =
    process.env.REACT_APP_STARCOIN_NETWORKS?.split(',') || ["main"];
const providerMap: Record<string, any> = {};
networks.forEach((n) => {
    providerMap[n] = new providers.JsonRpcProvider(
        `https://${n}-seed.starcoin.org`,
    );
});

export async function getTxnData(txnHash: string) {
    try {
        const provider = providerMap[getNetwork()];
        const result = await provider.getTransaction(txnHash);
        return result;
    } catch (error: any) {
        return false;
    }
}

export async function getBlockByNumber(hash: string) {
    try {
        const provider = providerMap[getNetwork()];
        const result = await provider.perform("getBlock", {
            blockHash: hash
        });
        return result;
    } catch (error: any) {
        window.console.info(error)
        return false;
    }
}

export async function getAddressData(hash: string) {
    try {
        const provider = providerMap[getNetwork()];
        const result = await provider.getResource(hash, '0x1::Account::Account');
        return result;
    } catch (error: any) {
        return false;
    }
}

export async function getAddressResources(hash: string) {
    try {
        const provider = providerMap[getNetwork()];
        const result = await provider.getResources(hash);
        return result;
    } catch (error: any) {
        return false;
    }
}

export async function getBalancesData(hash: string) {
    try {
        const provider = providerMap[getNetwork()];
        const result = await provider.getBalances(hash);
        return result;
    } catch (error: any) {
        return false;
    }
}

export async function getAddressSTCBalance(hash: string) {
    try {
        const provider = providerMap[getNetwork()];
        const result = await provider.getResource(
            hash,
            '0x1::Account::Balance<0x1::STC::STC>',
        );
        return result;
    } catch (error: any) {
        return false;
    }
}

export async function getAddressModuleUpdateStrategy(hash: string) {
    try {
        const provider = providerMap[getNetwork()];
        const result = await provider.callV2({
            function_id: '0x1::PackageTxnManager::get_module_upgrade_strategy',
            type_args: [],
            args: [hash],
        });
        return result;
    } catch (error: any) {
        return false;
    }
}

export async function getAddressUpgradePlanCapability(hash: string) {
    try {
        const provider = providerMap[getNetwork()];
        const result = await provider.getResource(
            hash,
            '0x1::PackageTxnManager::UpgradePlanCapability',
        );
        return result;
    } catch (error: any) {
        return false;
    }
}

export async function getAddressUpgradeModuleCapability(hash: string) {
    try {
        const provider = providerMap[getNetwork()];
        const result = await provider.getResource(
            hash,
            '0x1::UpgradeModuleDaoProposal::UpgradeModuleCapability',
        );
        return result;
    } catch (error: any) {
        return false;
    }
}

export async function getEpochData() {
    try {
        const provider = providerMap[getNetwork()];
        const result = await provider.getResource('0x1', '0x1::Epoch::Epoch');
        return result;
    } catch (error: any) {
        return false;
    }
}

export async function getTokenPrecision(tokenTypeTag: string) {
    try {
        const provider = providerMap[getNetwork()];
        const result = await provider.callV2({
            function_id: '0x1::Token::scaling_factor',
            type_args: [tokenTypeTag],
            args: [],
        });
        return result;
    } catch (error: any) {
        return false;
    }
}


export async function getNodeInfo(node: string) {
    const provider = new providers.JsonRpcProvider(
        node,
    );
    const result = provider.perform(providers.RPC_ACTION.getNodeInfo, []);
    return result;
}


export async function getGasPrice() {
    const provider = providerMap[getNetwork()];
    const result = provider.perform(providers.RPC_ACTION.getGasPrice, [1]);
    return result;
}

