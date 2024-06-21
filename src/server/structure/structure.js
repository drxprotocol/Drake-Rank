import BigNumber from "bignumber.js";

export const Instrument = class {
    id = 0;
    name = '';
    baseCcy = '';
    quoteCcy = '';
    settleCcy = '';

    constructor(id, name, baseCcy, quoteCcy, settleCcy) {
        this.id = id;
        this.name = name;
        this.baseCcy = baseCcy;
        this.quoteCcy = quoteCcy;
        this.settleCcy = settleCcy;
    }
};

export const Price = class {
    id = '';
    name = '';
    price = new BigNumber(0);
    tokenPrice = new BigNumber(0);
    isRelative = false;
    instrument = new Instrument();
    fullReport = null;

    constructor(id, name, price, isRelative, instrument, fullReport, tokenPrice){
        this.id = id;
        this.name = name;
        this.price = price;
        this.isRelative = isRelative;
        this.instrument = instrument;
        this.fullReport = fullReport;
        this.tokenPrice = tokenPrice || price;
    }
};

export const TRADING_ORDER_SIDE = {
    Long: 1,
    Short: 2,
};

export const SIZE_SCALING_FACTOR = `10000`;
export const RATIO_SCALING_FACTOR = `10000`;
export const VALUE_SCALING_FACTOR = `100000000`;
