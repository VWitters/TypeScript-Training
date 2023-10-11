// @ts-check
import { Parcel } from "@parcel/core"
import e from 'express';
import jsonServer from 'json-server';
import { setupAPI } from './api-server.mjs';
import { join }  from 'path';
import * as pkgUp from 'pkg-up';
 
const server = jsonServer.create();

const PORT = process.env['PORT'] || 3000;
const PKG_JSON_PATH = pkgUp.pkgUpSync();
if (!PKG_JSON_PATH) throw new Error('Could not determine package.json path');
console.log("Directory: " + PKG_JSON_PATH)
const DIR_NAME = join(PKG_JSON_PATH, '..');
const DIST_INDEX_HTML = join(DIR_NAME, "dist", "index.html")
const app = e();

setupAPI(server);


const file = join(DIR_NAME, 'index.html'); // Pass an absolute path to the entrypoint here
const options = {}; // See options section of api docs, for the possibilities

// Initialize a new bundler using a file and options
const bundler = new Parcel({ entries: file, defaultConfig: '@parcel/config-default',
defaultTargetOptions: {
    engines: {
      browsers: ['last 1 Chrome version']
    }
  }})

await bundler.watch((err, buildEvent) => {
    if(buildEvent && buildEvent.type === "buildSuccess") {
        const { buildTime } = buildEvent;
        console.log(`🏗️ UI build complete: ${buildTime/1000}s`)
        
    }
    if(err) console.error(err);
});
console.log("UI Build Watcher Started")

app.use('/assets', e.static(join(DIR_NAME, 'assets')));
app.use(server);
app.get("*", (req, res, next) => {
    if (req.path.endsWith(".js")) { next(); return; }
    if (req.path.endsWith(".css")) { next(); return; }
    if (req.accepts("*/html") === "*/html") {
        res.sendFile(DIST_INDEX_HTML)
    }
    else next();
});
app.get("*", e.static(join(DIR_NAME, "dist")))

// Listen on port PORT
app.listen(PORT, () => {
    console.log(`Serving on http://localhost:${PORT}`)
});