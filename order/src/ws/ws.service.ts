import { Injectable } from '@nestjs/common';
import { NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { SocketAuthenticated } from '../components/auth/interfaces/ws-authenticated.interface';
import { AuthenticatedUser } from 'src/components/auth/interfaces/ws-authenticated.interface';

@Injectable()
export class WsService {
  getHello(): string {
    return 'Hello world!';
  }
  async verifyWS(socket: SocketAuthenticated, next: NextFunction) {
    const bearerToken = socket.handshake.auth.Authorization;
    try {
      const user: AuthenticatedUser = await this.verifyBearerToken(bearerToken);
      socket.handshake.auth.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }

  async verifyBearerToken(bearerToken: string): Promise<AuthenticatedUser> {
    const token = bearerToken.replace(/^Bearer\s+/, '');
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.APP_KEY, async (err: Error, user: AuthenticatedUser) => {
        if (err || !user) {
          return reject(err);
        }
        resolve(user);
      });
    });
  }
}
