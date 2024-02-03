// google-calendar.service.ts

import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleCalendarService {
  private readonly calendar = google.calendar('v3');

  // Configuración del cliente de Google Calendar
  private readonly auth = new google.auth.GoogleAuth({
    keyFile: 'googlecal/client_secret_732590111335-99m52fuhjk3rj0lrip0i1pde627sstsi.apps.googleusercontent.com.json',
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  // ID de tu calendario de Google
  private readonly calendarId = 'primary';
  private readonly timeZone = 'America/Argentina/Buenos_Aires'; // Ajusta la zona horaria según tu necesidad

  async syncEvents(reservedTurns: any[]) {
    for (const turn of reservedTurns) {
      const event = {
        summary: `Turno con ${turn.client.user.firstName} ${turn.client.user.lastName}`,
        start: {
          dateTime: `${turn.monthDay}T${turn.dateFrom}`,
          timeZone: this.timeZone, 
        },
        end: {
          dateTime: `${turn.monthDay}T${turn.dateTo}`,
          timeZone: this.timeZone, 
        },
        description: `Información adicional sobre el turno: ${turn.id}`,
      };

      try {
        const response = await this.calendar.events.insert({
          auth: this.auth,
          calendarId: this.calendarId,
        });

        console.log('Evento creado:', response.data);
      } catch (error) {
        console.error('Error al crear el evento:', error.message);
      }
    }
  }
}
