import app from './app';
import { env } from './env';
import { initializeDatabase, closeDatabase } from './database';

async function start() {
  try {
    await initializeDatabase();

    const server = app.listen(env.port, () => {
      console.log(`API listening on port ${env.port}`);
    });

    const shutDown = () => {
      server.close(() => {
        console.log('Server closed gracefully');
        closeDatabase().then(() => {
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', shutDown);
    process.on('SIGINT', shutDown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
