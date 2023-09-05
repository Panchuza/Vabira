import { Professional } from "./professional.dto";
export class ReportProjectionResponse{
    enterprise: string;
    serviceCode: string;
    status:string
    qtyHours:number
    clientFee:number
    billedToClient:number
    professional:string
    professionalFee:number
    professionalCost:number
    billedLessCost:number
}