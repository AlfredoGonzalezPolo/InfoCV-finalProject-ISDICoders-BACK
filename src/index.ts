import http from 'http';
import { app } from './app.js';
import { dbConnect } from './db/db.connect.js';

import createDebug from 'debug';
const debug = createDebug('INFOCV');

const server = http.createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('Connected to dataBase: ', mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    server.emit('error', error);
  });

const PORT = process.env.PORT || 1312;

server.on('listening', () => {
  debug('Listening on port ' + PORT);
});

server.on('error', (error) => {
  debug(error.message);
});
