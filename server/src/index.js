import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import routes from './routes/index.js';


const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(
cors({
origin: process.env.CLIENT_ORIGIN?.split(',') || '*',
credentials: false,
})
);


app.use('/api', routes);


const PORT = process.env.PORT || 5000;


async function start() {
await mongoose.connect(process.env.MONGODB_URI);
app.listen(PORT, () => console.log(`Server listening on :${PORT}`));
}


start().catch((e) => {
console.error('Failed to start server', e);
process.exit(1);
});