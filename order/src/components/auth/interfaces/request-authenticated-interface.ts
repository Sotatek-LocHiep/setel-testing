import { Request } from 'express';

export const authenticatedFields = ['id', 'username'];

export interface AuthenticatedUser {
  id: number;
}
export interface RequestAuthenticated extends Request {
  user: AuthenticatedUser;
}
