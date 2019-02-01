import * as Koa from 'koa';
import { Bepoz } from './bepozAPIHelper';
import * as xml2js from 'xml-js';
import env from './environment';

const app = new Koa();
const con = Bepoz.connect(env.BEPOZ_API.URL, env.BEPOZ_API.PORT, env.BEPOZ_API.MAC);

app.use(async (ctx:any, next:any) => {
    try {
        await next();
        const rt = ctx.response.get('X-Response-Time');
        console.log(`${ctx.method} ${ctx.url} - ${rt}`);
    } catch (error) {
        ctx.response.status = 400;
        ctx.body = {error};
    }
});

// x-response-time

app.use(async (ctx:any, next:any) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app.use(async (ctx:any) => {
    const res = await con.SystemCheck();
    ctx.set('Content-Type', 'application/json');
    ctx.set('Env-Type', env.ENV_TYPE);
    ctx.body = res;
});

app.listen(3000, () => {
    console.log('listening to port 3000!');
});