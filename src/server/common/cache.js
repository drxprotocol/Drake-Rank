
export const Cache = class {
    cachedData = new Map();

    constructor(expired) {
        this.expired = expired || 58 * 1000;
    }

    set(key, value){
        let now = new Date();
        let expiredTime = now.getTime() + this.expired;
        let cacheData = {
            expired: expiredTime,
            data: value,
        };

        this.cachedData.set(key, cacheData);
    }

    has(key){
        if(this.cachedData.has(key)){
            let cacheData = this.cachedData.get(key);
            let now = new Date();

            if(now.getTime() > cacheData.expired){
                this.cachedData.delete(key);
                return false
            }

            return true;
        }

        return false;
    }

    get(key){
        if(this.cachedData.has(key)){
            let cacheData = this.cachedData.get(key);
            let now = new Date();

            // console.debug(
            //     `key =>`, key,
            //     `now.getTime() =>`, now.getTime(),
            //     `cacheData.expired =>`, cacheData.expired,
            //     `expired =>`, now.getTime() > cacheData.expired
            // );

            if(now.getTime() > cacheData.expired){
                this.cachedData.delete(key);
                return null
            }

            return cacheData.data;
        }

        return null;
    }

    delete(key){
        this.cachedData.delete(key);
    }
};