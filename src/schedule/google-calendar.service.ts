// google-calendar.service.ts

import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { format, parse } from 'date-fns';

@Injectable()
export class GoogleCalendarService {
  
  private calendar: any; // Declara la variable sin inicializar

  private readonly timeZone = 'America/Argentina/Buenos_Aires';

  constructor() {
    // Carga la clave privada de la cuenta de servicio
    const credentials = require('/Users/braulio/Proyecto/GitHub/Vabira/src/schedule/theta-messenger-412914-b763803f2224.json'); // Reemplaza con la ruta correcta

    // Crea el cliente de Google con la cuenta de servicio
    const client = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    // Inicializa el cliente de calendario
    this.calendar = google.calendar({ version: 'v3', auth: client });
  }

  async syncEvents(reservedTurns: any[], calendarId: string) {


    for (const turn of reservedTurns) {
      const formattedMonthDay = format(parse(turn.monthDay, 'MM/dd', new Date()), '2024-dd-MM');

      // Formatear turn.dateFrom y turn.dateTo a 'hh:mm a'
      const formattedDateFrom = format(parse(turn.dateFrom, 'hh:mm a', new Date()), 'HH:mm:ssXXX');
      const formattedDateTo = format(parse(turn.dateTo, 'hh:mm a', new Date()), 'HH:mm:ssXXX');
      console.log(turn.monthDay)
      
      const event = {
        summary: `Turno con ${turn.client.user.firstName} ${turn.client.user.lastName}`,
        start: {
          dateTime: `${formattedMonthDay}T${formattedDateFrom}`,
          timeZone: this.timeZone,
        },
        end: {
          dateTime: `${formattedMonthDay}T${formattedDateTo}`,
          timeZone: this.timeZone,
        },
        description: `Información adicional sobre el turno: ${turn.id}`,
      };
      // const event = {
      //   'summary': 'Google I/O 2015',
      //   'location': '800 Howard St., San Francisco, CA 94103',
      //   'description': 'A chance to hear more about Google\'s developer products.',
      //   'start': {
      //     'dateTime': '2024-02-10T09:00:00-07:00',
      //     'timeZone': 'America/Los_Angeles',
      //   },
      //   'end': {
      //     'dateTime': '2024-02-10T11:00:00-07:00',
      //     'timeZone': 'America/Los_Angeles',
      //   }
      // };
      

      try {
        const response = await this.calendar.events.insert({
          calendarId: calendarId, // Utiliza el calendario proporcionado como parámetro
          requestBody: event,
        });

        console.log('Evento creado:', response.data);
      } catch (error) {
        console.error('Error al crear el evento:', error.message)
      }
    }
  }
}