// google-auth.controller.ts

import { Controller, Get, Redirect, Query } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';

@Controller('google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get()
  @Redirect()
  async redirectToGoogleAuth() {
    return await this.googleAuthService.getAuthorizationUrl();
  }

  @Get('callback')
  async googleAuthCallback(@Query() queryParams: any) {
    return this.googleAuthService.handleCallback(queryParams);
  }
}

