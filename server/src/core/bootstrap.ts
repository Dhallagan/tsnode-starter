import * as express from 'express';
import * as http from 'http';
import * as path from 'path'
import {Database} from '../core/database'
import { Server } from './server';
//import { Seeds } from './seeds';
import { Authentication } from './middleware/authentication'
import { UserRoutes } from '../routes/user.routes';
import * as dotenv from 'dotenv';

const root = './';

export class Bootstrap {

    public defineExpressApp(app: express.Application) {
        app.set('port', process.env.PORT || Server.normalizePort(3000));
    }

    public startServer(app: express.Application): http.Server {
        return app.listen(app.get('port'));
    }

    public setupEnviroment(app: express.Application): void {
        console.log('Setting up enviroment variables...');
        dotenv.config({ path: "./src/config/.env.development" });
    }

    public setupDatabase(app: express.Application): void {
        // Retrieve all queries
        // TODO: not sure if .then is wrong because queries is empty until then (should be await)
        console.log('Setting up database connection...')
        Database.createConnection();
        //console.log('Seeding database...')
        //Seeds.seedUsers();
    }

    public setupCors(app: express.Application): void {
        console.log("Setting up CORS...")
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', 'http://localhost:8080' );
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
            res.header('Access-Control-Allow-Credentials', 'true');
            next();
        });
    }

    public setupStorage(app: express.Application): void {
        console.log("Setting up storage...")

        console.log(path.join(__dirname, "uploads"))
        app.use(
          express.static(path.join(__dirname, "uploads"), { maxAge: 31557600000 })
        );
    }

    public setupAuthentication(app: express.Application): void {
        console.log("Setting up authentication...")
        app.use(Authentication.isAuthenticated);
    }

    public setupRoutes(app: express.Application): void {
     
        // serving api routes
        // const generalRouter = new GeneralRoutes().router;
        //const usersRouter = new UsersRoutes().router;
        console.log("Setting up routes...")
        const userRouter = new UserRoutes().router;
        app.use('/api', userRouter);
        //app.use('/api', usersRouter);
    }
}
