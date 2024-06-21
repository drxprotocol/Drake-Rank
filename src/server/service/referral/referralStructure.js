
export const Referral = class {
    address = '';
    referralCode = '';
    referredAddress = '';
    referredCode = '';
    createTime = 0;

    constructor({
                    address = '',
                    referralCode = '',
                    referredAddress = '',
                    referredCode = '',
                }) {
        this.address = address;
        this.referralCode = referralCode;
        this.referredAddress = referredAddress;
        this.referredCode = referredCode;
        this.createTime = new Date().getTime();
    }
};