
export const Referral = class {
    table = 'Referral';
    address = '';
    referralCode = '';
    referredAddress = '';
    referredCode = '';
    impAddress = '';
    cmpAddress = '';
    createTime = 0;

    constructor({
                    address = '',
                    referralCode = '',
                    referredAddress = '',
                    referredCode = '',
                    impAddress = '',
                    cmpAddress = '',
                }) {
        this.address = address;
        this.referralCode = referralCode;
        this.referredAddress = referredAddress;
        this.referredCode = referredCode;
        this.impAddress = impAddress;
        this.cmpAddress= cmpAddress;
        this.createTime = new Date().getTime();
    }
};