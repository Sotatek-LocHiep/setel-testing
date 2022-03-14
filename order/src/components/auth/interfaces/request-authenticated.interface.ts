import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
export const authenticatedFields = ['id', 'username'];

export interface AuthenticatedUser extends JwtPayload {
  id: number;
}
export interface RequestAuthenticated extends Request {
  user: AuthenticatedUser;
}
