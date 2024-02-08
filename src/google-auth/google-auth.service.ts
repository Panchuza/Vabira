// google-auth.service.ts

import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleAuthService {
  private readonly oauth2Client = new google.auth.OAuth2(
    '732590111335-99m52fuhjk3rj0lrip0i1pde627sstsi.apps.googleusercontent.com', // Reemplaza con el ID de cliente de tu aplicación
    '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', // Reemplaza con el secreto de cliente de tu aplicación
    'http://localhost:3000/google-auth/callback' // Ajusta según tus configuraciones
  );

  getAuthorizationUrl(): { authorizationUrl: string } {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
    });

    return { authorizationUrl: authUrl };
  }

  async handleCallback(queryParams: any): Promise<any> {
    const { code } = queryParams;

    if (!code) {
      throw new HttpException('Código de autorización no proporcionado.', HttpStatus.BAD_REQUEST);
    }

    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      return tokens;
    } catch (error) {
      throw new HttpException('Error al obtener tokens de acceso.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
