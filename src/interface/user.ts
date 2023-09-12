import { Request } from 'express';

export interface Isuser {
  readonly name: string;
  org_id: number;
  readonly email: string;
}

export interface IsEmailpayload {
  readonly email: string;
}

export interface ModifyRequest extends Request {
  user: {
    name: string;
    email: string;
    id: number;
  };
  org: {
    org_id: number;
    org_name: string;
    org_code: string;
  };
}

export interface Ispayload {
  header: {
    header: string;
  };
  payload: {
    email: string;
  };
  // signature: string;
}

export interface isRegionPrams {
  id: number;
}

export interface isPortIdParams {
  port_id: number;
}

export interface isPortDisParams {
  dis_id: string;
}
export interface PortObject {
  minTerm?: string;
  link_loa?: string;
  marketPlace?: string;
  port_code?: string;
  available_BW?: string;
  used_BW?: string;
  portName?: string;
  port_speed?: string;
  operational_state?: string;
  admin_status?: string;
  display_port_id?: string;
  [key: string]: any;
}
