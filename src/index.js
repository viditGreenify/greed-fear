// const mongoose = require('mongoose');
// const app = require('./app');
// const config = require('./config/config');
// const logger = require('./config/logger');

// let server;
// mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
//   logger.info('Connected to MongoDB');
//   server = app.listen(config.port, () => {
//     logger.info(`Listening to port ${config.port}`);
//   });
// });

// const exitHandler = () => {
//   if (server) {
//     server.close(() => {
//       logger.info('Server closed');
//       process.exit(1);
//     });
//   } else {
//     process.exit(1);
//   }
// };

// const unexpectedErrorHandler = (error) => {
//   logger.error(error);
//   exitHandler();
// };

// process.on('uncaughtException', unexpectedErrorHandler);
// process.on('unhandledRejection', unexpectedErrorHandler);

// process.on('SIGTERM', () => {
//   logger.info('SIGTERM received');
//   if (server) {
//     server.close();
//   }
// });

const mongoose = require('mongoose');
const { Server } = require('socket.io');
const app = require('./app');
// eslint-disable-next-line import/order
const server = require('http').createServer(app);

const config = require('./config/config');
const logger = require('./config/logger');

// let server;
// mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
//   logger.info('Connected to MongoDB');

  app.set('port', config.port);
  server.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
  // server = app.listen(config.port, () => {
  //   logger.info(`Listening to port ${config.port}`);
  // });

  const io = new Server(server, {
    cors: {
      origin: '*',
    },
    pingInterval: 10000,
    pingTimeout: 5000,
  });

  io.engine.on('connection_error', (err) => {
    logger.error(`Received error on socket connection:`);
    logger.error(`Passed query params: ${JSON.stringify(err.req)}`);
    logger.error(`Code: ${err.code}. Message: ${err.message}`);
  });

  const connectedClients = new Map();

  io.use(async function (socket, next) {
    try {
      // await socketAuth(socket);
      next();
    } catch (err) {
      return next(err);
    }
  }).on('connection', (socket) => {
     //console.log('connection', socket.user._id);

    // socket.join(socket.user._id);
     //const socketKey = `${socket.user._id}}`;

     //connectedClients.set(socketKey, socket.id);

    logger.info(`Client connected.`);

    //console.log(socket);

    socket.on('disconnect', (dis) => {
      // connectedClients.delete(socketKey);

      logger.info(`Client disconnected. User ID: ${socket}. }`);
    });
  });

  global.io = io;
  global.connectedClients = connectedClients;
// });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
