import { envs } from "./config/env";
import { PostgresDatabase } from "./data";
import { AppRoutes } from "./presentation/app.routes";
import { Server } from "./presentation/app.server";


(async()=>{
    main();
})()

async function main(){

    //Aqui conexión a la base de datos, new postgresql
    const postgres = new PostgresDatabase({
        host: envs.DB_HOST,
        port: envs.DB_PORT,
        username:envs.DB_USERNAME,
        password:envs.DB_PASSWORD,
        database: envs.DB_DATABASE
      })
    await postgres.connect()  // llamamos al metodo connect y esperamos a que se establesca la conección


    // Aqui conexión al las rutas principales, new server

    const server = new Server({

        port:envs.PORT,
        routes:AppRoutes.routes
    });
    await server.start();

}


