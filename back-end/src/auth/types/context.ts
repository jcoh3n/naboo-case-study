import { PayloadDto } from './jwtPayload.dto';
import { Request, Response } from 'express';

export interface ContextWithJWTPayload {
  jwtPayload: PayloadDto | null;
  req: Request;
  res: Response;
}
