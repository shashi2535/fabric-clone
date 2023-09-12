import { HttpStatus } from '@nestjs/common';
import { HttpMessage } from 'src/constrant';
import { Request, Response } from 'express';
import { Knex } from 'knex';
import ShortUniqueId from 'short-unique-id';
const uid = new ShortUniqueId({ length: 10 });
export const addToCart = async (req, res, createPortDto, knex) => {
  try {
    const { dc_id, region_id, minTerm, portName, port_speed, type, status } =
      createPortDto;
    const getPodData = await knex('pod')
      .where({
        dc_id: dc_id,
      })
      .first()
      .returning('*');
    if (!getPodData) {
      return res.json({ message: HttpMessage.POD_NOT_PRESENT });
    }
    if (getPodData) {
      const findregionData = await knex('region')
        .where({
          id: region_id,
        })
        .first()
        .returning('*');
      const findDatacenterData = await knex('datacenter')
        .where({
          id: dc_id,
        })
        .first()
        .returning('*');
      const addSavePort = await knex('port').insert({
        portName: portName,
        port_id: uid(),
        org_code: req.org.org_code,
        user_email: req.user.email,
        user_name: req.user.name,
        admin_status: 'Provisioning',
        port_speed: port_speed,
        region_id: region_id,
        dc_id: dc_id,
        pod_id: `${getPodData.id}`,
        port_code: `${findregionData.region_code}-${findDatacenterData.dc_code}-${getPodData.pod_code}`,
        status: status,
        minTerm: minTerm,
      });

      if (!addSavePort) {
        return res.json({ message: HttpMessage.NOT_SAVE_CONFIGRATION });
      }

      if (addSavePort) {
        return res.json({
          message: HttpMessage.CONFIGRATION_SAVED,
          result: addSavePort,
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errors: err.message,
      message: HttpMessage.INTERNAL_SERVER_ERROR,
    });
  }
};
