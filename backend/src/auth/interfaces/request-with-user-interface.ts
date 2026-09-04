import { Request } from 'express';
import { JwtPayload } from './jwt.payload.interface';

// Extends Express's Request to include the user attached by AuthGuard
export interface RequestWithUser extends Request {
  user: JwtPayload; // { sub: number, email: string }
}
