import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';
import { Request, Response } from 'express';
import { HttpMessage } from 'src/constrant';
@Injectable()
export class VrfService {
  constructor(@InjectModel() private readonly knex: Knex) {}
  async createVrfData(req: Request, res: Response) {
    try {
      const data = [
        {
          vrf_number: 1,
          name: 'main01',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 2,
          name: 'main02',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 3,
          name: 'main03',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 4,
          name: 'main04',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 5,
          name: 'main05',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 6,
          name: 'main06',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 7,
          name: 'main07',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 8,
          name: 'main08',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 9,
          name: 'main9',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 10,
          name: 'main10',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 11,
          name: 'main11',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 12,
          name: 'main12',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 13,
          name: 'main13',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 14,
          name: 'main14',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 15,
          name: 'main15',
          l3vrf_total_range: 250,
        },

        {
          vrf_number: 16,
          name: 'main16',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 17,
          name: 'main17',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 18,
          name: 'main18',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 19,
          name: 'main19',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 20,
          name: 'main20',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 21,
          name: 'main21',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 22,
          name: 'main22',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 23,
          name: 'main23',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 24,
          name: 'main24',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 25,
          name: 'main25',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 26,
          name: 'main26',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 27,
          name: 'main27',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 28,
          name: 'main28',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 29,
          name: 'main29',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 30,
          name: 'main30',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 31,
          name: 'main31',
          l3vrf_total_range: 250,
        },
        {
          vrf_number: 32,
          name: 'main32',
          l3vrf_total_range: 250,
        },
      ];
      data.forEach(async (result) => {
        await this.knex('vrfGlobal').insert(result);
      });
      return res.json({
        message: HttpMessage.VF_CREATED,
      });
    } catch (err) {
      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
