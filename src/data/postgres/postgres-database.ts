import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Repair } from './entities/rapair.entity';


interface Options {

  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}
export class PostgresDatabase {

  private datasource: DataSource;  // inyectamos la clase DataSource

  constructor(options: Options) {

    this.datasource = new DataSource({
      type: 'postgres',   // importante parte de la sintaxis y conf, Le pasamos el tipo de base de datos utilizado
      host: options.host,
      port: options.port,
      username: options.username,
      password: options.password,
      database: options.database,
      entities: [User, Repair],  // le pasamos la entidad videogame para q el orm lo transforme a tabla
      synchronize: true,  // importante parte de la sintaxis y conf
      ssl:{
        rejectUnauthorized:false,  // importante parte de la sintaxis y conf
      }
    })
  }

  async connect() {   // importante parte de la sintaxis y conf 
    try { 
      await this.datasource.initialize()       
      console.log('Connected to database 😃')
    } catch (error) {
      console.log(error)
    }

  }
}
