import express from "express";
import config from "./src/config/config.js";
import loader from "./src/loaders/loader-index.js"

async function startServer() {
    const app = express();
    await loader(app)
    
    app.listen(config.port, err => {
      if (err) {
        console.log(err);
        process.exit(1);
        return;
      }
      console.log(`
        ################################################
            Server listening on port: ${config.port} 
        ################################################
      `);
    });
}

startServer()
