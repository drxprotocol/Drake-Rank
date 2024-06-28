import {chainConfig} from "../../../common/webThree.js";
import ContractConfig from "../../../../contract/ContractConfig.js";
import {Instrument} from "../../../structure/structure.js";

const instrumentMap = new Map();

let instruments = [];
export const getAllInstruments = () => {
    if(instruments.length){
        return instruments;
    }

    instruments = ContractConfig.getChainAddressConfig(chainConfig.chainId).instruments.map(instrumentConfig => {
        let tokens = instrumentConfig.tokens;
        let instrument = new Instrument(instrumentConfig.id, instrumentConfig.name, tokens.baseCcy, tokens.quoteCcy, tokens.settleCcy);

        instrumentMap.set(`${chainConfig.chainId}_${instrument.id}`, instrument);

        return instrument;
    });

    return instruments;
};

export const getInstrument = (instrumentId) => {
    let key = `${chainConfig.chainId}_${instrumentId}`;
    if(instrumentMap.has(key)){
        return instrumentMap.get(key);
    }

    getAllInstruments();

    return instrumentMap.get(key);
};