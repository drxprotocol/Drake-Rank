import {__dirname} from "./initDotenv.js";
import fs from 'fs';
import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import {initCronTask} from "./src/server/task/cronTask.js";
import ApplicationConfig from "./src/ApplicationConfig.js";
import {checkAndGenerateReferralCodeAction} from "./src/server/service/referral/referralAction.js";
import {getLastRanking, getLastTopRanking, getMyRanking} from "./src/server/service/pnlRank/pnlRankAction.js";
import {initDatabase} from "./src/server/common/database.js";

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

    app.get('/pnlRanking/last',function(req,res,next){
        getLastRanking(req, res);
    });

    app.get('/pnlRanking/top',function(req,res,next){
        getLastTopRanking(req, res);
    });

    app.get('/pnlRanking/my',function(req,res,next){
        getMyRanking(req, res);
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
    console.debug(`init server: process.env.CURRENT_CHAIN =>`, process.env.CURRENT_CHAIN);

    initWebServer();
    initBackendService();
};

init();