import { Body, Controller, Get, Post, UseGuards, Req, Headers, Query, } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { UserRoleGuard } from './guard/user-role.guard';
import { ValidRoles } from './interfaces';
import { RawHeaders, GetUser, Auth } from './decorators';
import { RoleProtected } from './decorators/role-protected.decorator';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { EmailDto } from './dto/email.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService
  ) { }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Post('verify-token')
  async verifyToken(@Body() { token }: { token: string }) {
    return this.authService.checkToken(token);
  }

  @Post('sendEmail')
  sendEmail(@Body() emailDto: EmailDto){
    return this.authService.sendEmailCode(emailDto)
  }

  @Get('validateCode')
  validateCode(@Query('codigoGenerado') codigoGenerado: string, @Query('codigoIngresado') codigoIngresado: string){
    return this.authService.validateCode(codigoGenerado, codigoIngresado)
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.userService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }


  @Get('private2')
  @RoleProtected(ValidRoles.supplier, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard) 
  privateRoute2(@GetUser() user: User) 
  {
    return {
      ok: true,
      user
    }
  }


  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user
    }
  }
}
