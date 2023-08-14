import { HttpException, HttpStatus } from "@nestjs/common";

export class CommonException extends HttpException {
    constructor(mensage:string,status:HttpStatus=HttpStatus.INTERNAL_SERVER_ERROR) {
      super(mensage, status);
    }
}