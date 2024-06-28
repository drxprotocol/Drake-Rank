import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const initConfig = () => {
    let configFile = `.env.${process.env.NODE_ENV}`;
    console.debug(`__dirname =>`, __dirname, `configFile =>`, configFile);
    config({
        path: path.resolve(__dirname, configFile)
    });

    let env = process.env;
    console.debug(`ENV =>`, env);
};

initConfig();