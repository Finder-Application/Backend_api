import { Request } from 'express';
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Session {
  userName: string;
  uuid: string;
  userId: number;
}
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface RequestCustom extends Request {
  session: Session;
}
