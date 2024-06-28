import {executeUpdatePnLData, queryLastRankingArr, queryLastTopRankingArr, queryMyRankingArr} from "./pnlRankService.js";

export const generatePnLData = (request, response) => {
    executeUpdatePnLData().then(pnlData => {
        response.json(pnlData?.topRank);
    });
};

export const getLastRanking = (request, response) => {
    queryLastRankingArr().then(pnlData => {
        response.json(pnlData);
    });
};

export const getLastTopRanking = (request, response) => {
    queryLastTopRankingArr().then(pnlData => {
        response.json(pnlData);
    });
};

export const getMyRanking = (request, response) => {
    let {address} = request.query;
    queryMyRankingArr(address).then(pnlData => {
        response.json(pnlData);
    });
};