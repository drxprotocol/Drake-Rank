import {checkAndGenerateReferralCode} from "./referralService.js";
import {generateAddressSummary} from "../../../utils/StringFormat.js";

export const checkAndGenerateReferralCodeAction = (request, response) => {
    let {address, referredCode, impAddress, cmpAddress} = request.query;
    checkAndGenerateReferralCode(address, referredCode, impAddress, cmpAddress).then(referral => {
        let referralResponse = referral;
        console.debug(
            `checkAndGenerateReferralCodeAction:`,
            `address =>`, address,
            `referredCode =>`, referredCode,
            `referral =>`, referralResponse,
        );

        if(referralResponse?.referredAddress){
            let referredAddress = generateAddressSummary(referralResponse?.referredAddress, 6);
            referralResponse = {
                ...referralResponse,
                referredAddress,
            }
        }

        if(referralResponse?.impAddress){
            let impAddress = generateAddressSummary(referralResponse?.impAddress, 6);
            referralResponse = {
                ...referralResponse,
                impAddress,
            }
        }

        if(referralResponse?.cmpAddress){
            let cmpAddress = generateAddressSummary(referralResponse?.cmpAddress, 6);
            referralResponse = {
                ...referralResponse,
                cmpAddress,
            }
        }

        response.json(referralResponse);
    });
};