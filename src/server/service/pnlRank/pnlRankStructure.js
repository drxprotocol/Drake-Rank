
export const LastUpdatedTimeCacheKey = "LastUpdatedTime";

export const RankCacheKey = "LastRank";

export const Pnl = class {
    table = 'Pnl';
    address = '';
    usdcBalance = '';
    impAddress = '';
    cmpAddress = '';

    tradingPnl = '';
    volumeIn24 = '';
    volume = '';

    impEquity = '';
    impVolumeIn24 = '';
    impVolume = '';

    cmpEquity = '';
    cmpVolumeIn24 = '';
    cmpVolume = '';

    referralCode = '';
    referredSize = 0;
    referredAddress = [];
    referredPnl = '';

    feedbackBonus = 0;

    finalPnl = '';
    ranking = 0;

    lastUpdatedTime = 0;
    createTime = 0;

    constructor({
                    address = '',
                    usdcBalance = '',
                    impAddress = '',
                    cmpAddress = '',

                    tradingPnl = '',
                    volumeIn24 = '',
                    volume = '',

                    impEquity = '',
                    impVolumeIn24 = '',
                    impVolume = '',

                    cmpEquity = '',
                    cmpVolumeIn24 = '',
                    cmpVolume = '',

                    referralCode = '',
                    referredSize = 0,
                    referredAddress = [],
                    referredPnl = '',

                    feedbackBonus = 0,

                    finalPnl = '',
                    ranking = 0,

                    lastUpdatedTime = 0,
                }) {
        this.address = address;
        this.usdcBalance = usdcBalance;
        this.impAddress = impAddress;
        this.cmpAddress = cmpAddress;

        this.tradingPnl = tradingPnl;
        this.volumeIn24 = volumeIn24;
        this.volume = volume;

        this.impEquity = impEquity;
        this.impVolumeIn24 = impVolumeIn24;
        this.impVolume = impVolume;

        this.cmpEquity = cmpEquity;
        this.cmpVolumeIn24 = cmpVolumeIn24;
        this.cmpVolume = cmpVolume;

        this.referralCode = referralCode;
        this.referredSize = referredSize;
        this.referredAddress = referredAddress;
        this.referredPnl = referredPnl;

        this.feedbackBonus = feedbackBonus;

        this.finalPnl = finalPnl;
        this.ranking = ranking;

        this.lastUpdatedTime = lastUpdatedTime;
        this.createTime = new Date().getTime();
    }
};