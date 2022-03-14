import { INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';
import { DeliveryOrderCron } from '../components/order/crons/delivery-order.crons';
import { WsService } from './ws.service';

type CreateSocketParams = ServerOptions & {
  namespace?: string;
  server?: Server;
};

export class WsAdapter extends IoAdapter implements WebSocketAdapter {
  public constructor(
    private readonly app: INestApplicationContext,
    private readonly wsService: WsService,
    private readonly deliveryOrderCron: DeliveryOrderCron,
  ) {
    super(app);
  }

  public create(port: number, options?: CreateSocketParams): Server {
    const server = this.createIOServer(port, options);
    this.deliveryOrderCron.injectSocketServer(server);
    server.use(this.wsService.verifyWS.bind(this.wsService));

    return server;
  }

  public createIOServer(port: number, options?: ServerOptions): Server {
    if (this.httpServer && port === 0) {
      const server = new Server(this.httpServer, {
        cors: {
          allowedHeaders: ['Authorization'],
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
          origin: '*',
          preflightContinue: false,
          optionsSuccessStatus: 200,
        },
        // Allow 1MB of data per request.
        maxHttpBufferSize: 1e6,
      });
      return server;
    }
    return new Server(port, options);
  }

  public bindClientConnect(server: Server, callback: (socket: Socket) => void): void {
    server.on('connection', async (socket: Socket) => {
      const { user } = socket.handshake.auth;
      socket.join(`${user.id}`);
      socket.on('disconnect', async () => {
        socket.removeAllListeners();
      });
      callback(socket);
    });
  }
}
