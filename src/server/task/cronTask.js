import {scheduleJob} from 'node-schedule';
import ApplicationConfig from "../../ApplicationConfig.js";

const doInitCronTask = () => {
};

export const initCronTask = () => {
    if(process.env.DISABLE_TRADING_AUTOMATION !== 'true'){
        doInitCronTask();
    }
};