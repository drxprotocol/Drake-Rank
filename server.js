import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import {initCronTask} from "./src/server/task/cronTask.js";
import ApplicationConfig from "./src/ApplicationConfig.js";
import { config } from 'dotenv';
import {checkAndGenerateReferralCodeAction} from "./src/server/service/referral/referralAction.js";
import {initDatabase} from "./src/server/common/database.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const initConfig = () => {
    let configFile = `.env.${process.env.NODE_ENV}`;
    console.debug(`__dirname =>`, __dirname, `configFile =>`, configFile);
    config({
        path: path.resolve(__dirname, configFile)
    });

    let env = process.env;
    console.debug(`ENV =>`, env);
};


const initWebServer = async () => {
    const app = express();

    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
        base: '/'
    });

    app.use(vite.middlewares);
    app.use(express.json());

    app.get('/referral',function(req,res,next){
        checkAndGenerateReferralCodeAction(req, res);
    });

    app.use('*', async (req, res, next) => {
        const url = req.originalUrl.replace('/', '');

        try {
            let template = fs.readFileSync(
                path.resolve(__dirname, 'index.html'),
                'utf-8',
            );
            template = await vite.transformIndexHtml(url, template);
            let render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render;


            const rendered = await render(url);

            const html = template
                .replace(`<!--app-head-->`, rendered.head ?? '')
                .replace(`<!--app-html-->`, rendered.html ?? '');

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e) {
            vite.ssrFixStacktrace(e);
            next(e);
        }
    });

    let port = ApplicationConfig.serverPort;
    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`)
    });
};

const initBackendService = () => {
    initDatabase();
    initCronTask();
};


const init = () => {
    initConfig();
    initWebServer();
    initBackendService();
};

init();