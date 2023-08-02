import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import { resolve } from "path";

const dest= "dist/common/envs/";
const env: string | undefined = process.env.NODE_ENV;
const fallback: string = resolve(`${dest}/local.env`);
const filename: string = env ? `${env}.env` : 'local.env';
let filePath: string = resolve(`${dest}/${filename}`);
dotenv.config({ path: filePath })
console.log("filePath:"+filePath)

console.log("DATABASE_HOST:"+process.env.DATABASE_HOST);

export const Config : DataSourceOptions={
  type: "mssql",
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  // entities: ["dist/**/*.entity{.ts,.js}"],
  entities: [],
  migrations: ["dist/migrations/*{.ts,.js}"],
  migrationsRun:false,
  synchronize:false,
  extra: {
    trustServerCertificate: true,
  },
  options: {
    cryptoCredentialsDetails: {
      minVersion: "TLSv1"
    },
    encrypt: false 
  },
  logging: process.env.NODE_DEBUG === 'true' ? true: false
}

export const AppDataSource: DataSource = new DataSource(Config);