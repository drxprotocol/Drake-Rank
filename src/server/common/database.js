import TinyDB from "tinydb";

let _database = undefined;

export const initDatabase = () => {
    let dbPath = process.env.DATABASE_PATH || '~/db/drx.db';
    console.debug(`init database:`, dbPath);
    _database = new TinyDB(dbPath);

    return _database;
};

export const database = () => {
    if(_database){
        return _database;
    } else {
        return initDatabase();
    }
};