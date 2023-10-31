//import { getEnvPath } from "src/common/helper/env.helper";
import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { Accesses } from "../entities/accesses.entity";
import { AccessProfile } from "../entities/accessProfile.entity";
import { Alert } from "../entities/alert.entity";
import { Client } from "../entities/client.entity";
import { ClientStatus } from "../entities/clientStatus.entity";
import { Faq } from "../entities/faq.entity";
import { Product } from "../entities/product.entity";
import { Profiles } from "../entities/profile.entity";
import { ProfileUser } from "../entities/profileUser.entity";
import { PurchaseRecord } from "../entities/purchaseRecord.entity";
import { Receipt } from "../entities/receipt.entity";
import { Report } from "../entities/report.entity";
import { SaleRecord } from "../entities/saleRecord.entity";
import { Schedule } from "../entities/schedule.entity";
import { ScheduleDay } from "../entities/scheduleDay.entity";
import { Sign } from "../entities/sign.entity";
import { SignStatus } from "../entities/signStatus.entity";
import { Supplier } from "../entities/supplier.entity";
import { SupplierStatus } from "../entities/supplierStatus.entity";
import { Turn } from "../entities/turn.entity";
import { Turnero } from "../entities/turnero.entity";
import { TurnStatus } from "../entities/turnStatus.entity";
import { Type } from "../entities/type.entity";
import { TypeConfig } from "../entities/typeConfig.entity";
import { User } from "../entities/user.entity";
import { Address } from "../entities/address.entity";
import { ClientAddress } from "../entities/clientAddress.entity";
import { Continent } from "../entities/continent.entity";
import { Country } from "../entities/country.entity";
import { PoliticalDivision } from "../entities/politicalDivision.entity";
import { Region } from "../entities/region.entity";

const dest = "dist/common/envs/";
const env: string | undefined = process.env.NODE_ENV;
const fallback: string = resolve(`${dest}/local.env`);
const filename: string = env ? `${env}.env` : 'local.env';
let filePath: string = resolve(`${dest}/${filename}`);
dotenv.config({ path: filePath })
console.log("filePath:" + filePath)

console.log("DATABASE_HOST:" + process.env.DATABASE_HOST)

export const Config: DataSourceOptions = {
  type: "mysql",
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Accesses, Address, AccessProfile, Alert, Client, ClientAddress, ClientStatus, Continent, Country, Faq, PoliticalDivision, Product, Profiles, ProfileUser, PurchaseRecord, Receipt, Region, Report
    , SaleRecord, Schedule, ScheduleDay, Sign, SignStatus, Supplier, SupplierStatus, Turn, Turnero
, TurnStatus, Type, TypeConfig, User],
  migrations: ["dist/src/migrations/*{.ts,.js}"],
  migrationsRun: false,
  synchronize: false,
  // connectionTimeout: 60000,
  // requestTimeout: 90000,
  extra: {
    trustServerCertificate: true,
  },
  logging: true
}
export const AppDataSource: DataSource = new DataSource(Config);