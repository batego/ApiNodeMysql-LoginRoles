import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";

import * as cors from 'cors';
import * as helmet from 'helmet';
import Routes from "./routes/index";

const PORT = process.env.PORT || 3000;

createConnection().then(async () => {

    // create express app
    const app = express();
    // Middlewares
    app.use(cors());
    app.use(helmet());
    app.use(express.json());

    app.use('/', Routes);

    // start express server
    app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));

}).catch(error => console.log(error));
