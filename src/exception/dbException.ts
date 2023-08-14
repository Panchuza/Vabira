import { HttpException, HttpStatus } from "@nestjs/common";

export class DbException extends HttpException {
  constructor(error: any, status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
    super({
      msg: error.msg,
      code: error.code,
      errorMsg: error.driverError.originalError.info.message,
      query: error.query,
      parameters: error.parameters,
    }, status);
  }
}