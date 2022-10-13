process.on('uncaughtException', function(err){
   console.error(`I've crashed!!! - ${(err.stack || err)}`);
});
import * as util from 'util';
process.on('unhandledRejection', (reason, p) =>{
   console.error(`Unhandled Rejection at: ${util.inspect(p)} reason: ${reason}`);
});

import { notes } from './models/notes-store.mjs';
async function catchProcessDeath(){
   debug('urk.....');
   await NotesStore.close();
   await server.close();
   process.exit(0);
}
process.on('SIGTERM', catchProcessDeath); 
process.on('SIGINT', catchProcessDeath); 
process.on('SIGHUP', catchProcessDeath); 
process.on('exit', ()=>{debug('exiting...');});



import debug from 'debug';
import { dbgerror, port, server } from './app.mjs';

export function normalizePort(val){
   const port = parseInt(val, 10);
   if(isNaN(port)){
    return val;
   }
   if(port>=0){
    return port;
   }
   return false;
}

export function onError(error){
   dbgerror(error);
   switch(error.code){
         case 'ENOTESSTORE':
         console.error(`Notes data store initialization failure because`, error.error);
         process.exit(1);
         break;
   }

}



export function onListening(){
     const addr = server.address();
     const bind = typeof addr === 'string'
      ? 'pipe' + addr
      : 'port' + addr.port;
      debug(`listening on ${bind}`);
}


export function basicErrorHandler (err, req, res, next) {
   console.error(err.message);
if (res.headersSent) {
      return next(err)
    }
    res.status(500)
    res.render('error', { error: err })
  }

