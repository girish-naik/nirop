import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { IndexRouter } from './controllers/v0/index.router';
import {fetchSigningKeys, appConfig, JwtPayload, verifyToken} from '@bit/mr-obiwankenobi.nirop-chat-helpers.tummy'
import { syncSchemas } from './dataLayer/sync';

(async () => {
  const config = appConfig;
  var signingKeys = await fetchSigningKeys();
  await syncSchemas();
  const app = express();
  const port = config.port || 80; // default port to listen
  
  app.use(bodyParser.json());

  //CORS Should be restricted
  app.use(function(req: Request, res: Response, next) {
    res.header("Access-Control-Allow-Origin", config.allowedFrontendUrl);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  app.use(async function(req:Request, res:Response, next) {
    const authorizationHeader = req.header("authorization")
    try {
      const jwtPayload:JwtPayload = await verifyToken(signingKeys, authorizationHeader);
      res.locals.jwtPayload = jwtPayload
      next()
    } catch (err) {
      console.log(err)
      res.status(401).send({
        message : "Authentication failed."
      })
    }
  });

  app.use('/api/v0/', IndexRouter)

  // Root URI call
  app.get( "/", async ( req, res ) => {
    res.send( "/api/v0/" );
  });
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running ` + config.allowedFrontendUrl );
      console.log( `press CTRL+C to stop server` );
  });
})();