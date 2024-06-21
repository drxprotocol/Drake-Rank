import {database} from "../../common/database.js";
import {Referral} from "./referralStructure.js";
import {generate} from "referral-codes";

const generateReferralCode = () => {
    let codes = generate({length: 8});
    let referralCode = codes[0];
    return referralCode;
};

const generateReferralData = (address, referredAddress, referredCode) => {
    return new Promise((resolve, reject) => {
        let referralCode = generateReferralCode();

        let referral = new Referral({
            address, referralCode, referredAddress, referredCode
        });

        database().appendItem(referral, error => {
            console.debug(
                `save referral result:`,
                `error =>`, error,
            );

            resolve(referral);
        });
    });
};

const checkReferredCodeAndGenerateReferralCode = (address, referredCode) => {
    return new Promise((resolve, reject) => {
        if(!referredCode){
            generateReferralData(address).then(referral => {
                resolve(referral);
            });
        } else {
            database().find({referralCode: referredCode}, (err, items) => {
                console.debug(
                    `check referredCode:`,
                    `referralCode =>`, referredCode,
                    `items =>`, items,
                );

                if(items && items.length){
                    let referral = items[0];
                    let referredAddress = referral.address;
                    generateReferralData(address, referredAddress, referredCode).then(referral => {
                        resolve(referral);
                    });
                } else {
                    generateReferralData(address).then(referral => {
                        resolve(referral);
                    });
                }
            });
        }
    });
};

export const checkAndGenerateReferralCode = (address, referredCode) => {
    return new Promise((resolve, reject) => {
        database().find({address}, (err, items) => {
            console.debug(
                `checkAndGenerateReferralCode:`,
                `address =>`, address,
                `items =>`, items,
            );

            if(items && items.length){
                let referral = items[0];
                resolve(referral);
            } else {
                checkReferredCodeAndGenerateReferralCode(address, referredCode).then(referral => {
                    resolve(referral);
                });
            }
        });
    });
};