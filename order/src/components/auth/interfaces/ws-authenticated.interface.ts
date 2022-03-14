import { Socket } from 'socket.io';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedUser extends JwtPayload {
  id: number;
}

export interface SocketAuthenticated extends Socket {
  user: AuthenticatedUser;
}
