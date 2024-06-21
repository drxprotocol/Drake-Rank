import ApplicationConfig from "../../ApplicationConfig.js";
import Web3 from "web3";
import {Multicall} from 'ethereum-multicall';

export const currentChain =  process.env.CURRENT_CHAIN || 'chainConfigForBaseSepoliaTestNet';
export const chainConfig = ApplicationConfig[currentChain];
export const web3 = new Web3(chainConfig.rpcUrl);
export const multicall = new Multicall({ web3Instance: web3, tryAggregate: true, multicallCustomContractAddress: chainConfig.multicall3.address });