//import { getEnvPath } from "src/common/helper/env.helper";
import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { Access } from "src/entities/access.entity";
import { AccessProfile } from "src/entities/accessProfile.entity";
import { Alert } from "src/entities/alert.entity";
import { Client } from "src/entities/client.entity";
import { ClientStatus } from "src/entities/clientStatus.entity";
import { Faq } from "src/entities/faq.entity";
import { Product } from "src/entities/product.entity";
import { Profiles } from "src/entities/profile.entity";
import { ProfileUser } from "src/entities/profileUser.entity";
import { PurchaseRecord } from "src/entities/purchaseRecord.entity";
import { Report } from "src/entities/report.entity";
import { SaleRecord } from "src/entities/saleRecord.entity";
import { Schedule } from "src/entities/schedule.entity";
import { Sign } from "src/entities/sign.entity";
import { SignStatus } from "src/entities/signStatus.entity";
import { Supplier } from "src/entities/supplier.entity";
import { SupplierStatus } from "src/entities/supplierStatus.entity";
import { Turn } from "src/entities/turn.entity";
import { Turnero } from "src/entities/turnero.entity";
import { TurnStatus } from "src/entities/turnStatus.entity";
import { Type } from "src/entities/type.entity";
import { TypeConfig } from "src/entities/typeConfig.entity";
import { User } from "src/entities/user.entity";
import { Address } from "src/entities/address.entity";
import { ClientAddress } from "src/entities/clientAddress.entity";
import { Continent } from "src/entities/continent.entity";
import { Country } from "src/entities/country.entity";
import { PoliticalDivision } from "src/entities/politicalDivision.entity";
import { Region } from "src/entities/region.entity";

const dest = "dist/common/envs/";
const env: string | undefined = process.env.NODE_ENV;
const fallback: string = resolve(`${dest}/local.env`);
const filename: string = env ? `${env}.env` : 'local.env';
let filePath: string = resolve(`${dest}/${filename}`);
dotenv.config({ path: filePath })
console.log("filePath:" + filePath)

console.log("DATABASE_HOST:" + process.env.DATABASE_HOST)

export const Config: DataSourceOptions = {
  type: "mssql",
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Access, Address, AccessProfile, Alert, Client, ClientAddress, ClientStatus, Continent, Country, Faq, PoliticalDivision, Product, Profiles, ProfileUser, PurchaseRecord, Region, Report
    , SaleRecord, Schedule, Sign, SignStatus, Supplier, SupplierStatus, Turn, Turnero
, TurnStatus, Type, TypeConfig, User],
  migrations: ["dist/src/migrations/*{.ts,.js}"],
  migrationsRun: false,
  synchronize: true,
  connectionTimeout: 60000,
  requestTimeout: 90000,
  extra: {
    trustServerCertificate: true,
    createForeignKeyConstraints: false,
  },
  logging: true
}
export const AppDataSource: DataSource = new DataSource(Config);