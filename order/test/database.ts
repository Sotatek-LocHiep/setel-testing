import { OrderState } from '../src/components/order/entities/order-state.entity';
import { Order } from '../src/components/order/entities/order.entity';
import { OrderItem } from '../src/components/order/entities/order-item.entity';
import { Product } from '../src/components/product/entities/product.entity';
import { User } from '../src/components/user/entities/user.entity';

export default (): any => ({
  type: process.env.DB_CONNECTION_TEST || 'mysql',
  host: process.env.DB_HOST_TEST,
  username: process.env.DB_USERNAME_TEST,
  password: process.env.DB_PASSWORD_TEST,
  database: process.env.DB_DATABASE_TEST,
  port: parseInt(process.env.DB_PORT_TEST),
  entities: [User, Order, OrderState, OrderItem, Product],

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: process.env.DB_LOGGING === 'true',
  logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'database/migrations',
  },
});
