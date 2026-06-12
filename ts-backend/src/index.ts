import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongo } from './db/mongo';
import notesRouter from './routes/notes';
import statsRouter from './routes/stats';

dotenv.config();

const app = express();

// CORS - allows frontend to make requests to backend

//registering routes for notes and status

app.use(cors());
app.use(express.json());

app.use('/api/notes', notesRouter);
app.use('/api/stats', statsRouter);

const PORT = process.env.PORT || 4000;

//conn to monDB and stating server

connectMongo().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
