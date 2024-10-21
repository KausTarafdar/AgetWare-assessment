import express from 'express'

import { config } from './config/config';
import apiRouter from './api';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.listen(config.PORT, () => {
    console.log(`App is running on PORT ${config.PORT}`)
})