import {database} from "../../common/database.js";
import {Referral} from "./referralStructure.js";
import {generate} from "referral-codes";
import ApplicationConfig from "../../../ApplicationConfig.js";

export const queryReferral = (query = {}, callback) => {
    let _query = {
        ...query,
        table: 'Referral',
    };

    database().find(_query, callback);
};

export const queryReferred = (referralCode, callback) => {
    queryReferral({referredCode: referralCode}, callback);
};

const generateReferralCode = () => {
    let codes = generate({length: 8});
    let referralCode = codes[0];
    return referralCode;
};

const generateReferralData = (address, impAddress, cmpAddress, referredAddress, referredCode) => {
    return new Promise((resolve, reject) => {
        let referralCode = generateReferralCode();

        let referral = new Referral({
            address, referralCode, referredAddress, referredCode, impAddress, cmpAddress
        });

        database().appendItem(referral, error => {
            console.debug(
                `save referral result:`,
                `error =>`, error,
            );

            resolve(referral || {});
        });
    });
};

const checkReferredCodeAndGenerateReferralCode = (address, referredCode, impAddress, cmpAddress) => {
    return new Promise((resolve, reject) => {
        if(!impAddress || !cmpAddress){
            resolve({});
        }

        if(!referredCode){
            generateReferralData(address, impAddress, cmpAddress).then(referral => {
                resolve(referral);
            });
        } else {
            queryReferral({referralCode: referredCode}, (err, items) => {
                console.debug(
                    `check referredCode:`,
                    `referralCode =>`, referredCode,
                    `items =>`, items,
                );

                if(items && items.length){
                    queryReferral({referredCode: referredCode}, (err, referredItems) => {
                        let _referredItems = referredItems || [];
                        console.debug(
                            `check referred size:`,
                            `referred size =>`, _referredItems?.length,
                            `items =>`, _referredItems,
                        );

                        if(_referredItems.length < ApplicationConfig.maxRefer){
                            let referral = items[0];
                            let referredAddress = referral.address;
                            generateReferralData(address, impAddress, cmpAddress, referredAddress, referredCode).then(referral => {
                                resolve(referral);
                            });
                        } else {
                            generateReferralData(address, impAddress, cmpAddress).then(referral => {
                                resolve(referral);
                            });
                        }
                    });
                } else {
                    generateReferralData(address, impAddress, cmpAddress).then(referral => {
                        resolve(referral);
                    });
                }
            });
        }
    });
};

export const checkAndGenerateReferralCode = (address, referredCode, impAddress, cmpAddress) => {
    return new Promise((resolve, reject) => {
        queryReferral({address}, (err, items) => {
            console.debug(
                `checkAndGenerateReferralCode:`,
                `address =>`, address,
                `items =>`, items,
            );

            if(items && items.length){
                let referral = items[0];
                resolve(referral);
            } else {
                checkReferredCodeAndGenerateReferralCode(address, referredCode, impAddress, cmpAddress).then(referral => {
                    resolve(referral);
                });
            }
        });
    });
};