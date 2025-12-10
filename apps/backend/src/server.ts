import app from './app';
import { env } from './env';

const server = app.listen(env.port, () => {
  console.log(`API listening on port ${env.port}`);
});

const shutDown = () => {
  server.close(() => {
    console.log('Server closed gracefully');
    process.exit(0);
  });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
