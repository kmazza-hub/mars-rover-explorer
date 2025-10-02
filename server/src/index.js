import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 5000;

async function start() {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(PORT, () => console.log(`Server listening on :${PORT}`));
}

start().catch((e) => {
  console.error('Failed to start server', e);
  process.exit(1);
});
