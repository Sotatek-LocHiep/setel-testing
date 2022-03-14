import io, { Socket } from 'socket.io-client'

export class WebSocketService {
  public static socketClient: Socket
  private static currentToken: string

  public static async init(token: string) {
    if (!this.socketClient && this.currentToken !== token) {
      this.currentToken = token
      this.socketClient = io(process.env.REACT_APP_API_URL as string, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 500,
        auth: { Authorization: `Bearer ${token}` },
      })
    }
  }
  public static async disconnect() {
    if (this.socketClient) {
      this.socketClient.disconnect()
    }
  }
}
