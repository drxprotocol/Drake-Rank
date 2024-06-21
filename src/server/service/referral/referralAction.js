import {checkAndGenerateReferralCode} from "./referralService.js";

export const checkAndGenerateReferralCodeAction = (request, response) => {
    let {address, referredCode} = request.query;
    checkAndGenerateReferralCode(address, referredCode).then(referral => {
        console.debug(
            `checkAndGenerateReferralCodeAction:`,
            `address =>`, address,
            `referredCode =>`, referredCode,
            `referral =>`, referral,
        );

        response.json(referral);
    });
};