import {scheduleJob} from 'node-schedule';
import ApplicationConfig from "../../ApplicationConfig.js";
import {updatePnLData} from "../service/pnlRank/pnlRankService.js";

const initTradingPnLTask = () => {
    if(process.env.DISABLE_TRADING_TRADING_PNL !== 'true'){
        let interval = process.env.TASK_INTERVAL_TRADING_PNL || ApplicationConfig.taskIntervalTradingPnL;
        let taskName = 'drx_task_update_trading_pnl';
        scheduleJob(taskName, interval, () => {
            let now = new Date().getTime();
            console.debug(`${taskName}:`, now);

            updatePnLData();
        });
    }
};

const doInitCronTask = () => {
    initTradingPnLTask();
};

export const initCronTask = () => {
    if(process.env.DISABLE_TRADING_AUTOMATION !== 'true'){
        doInitCronTask();
    }
};