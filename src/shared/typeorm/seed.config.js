const { config } = require('dotenv');
const { resolve } = require('path');

const envPath =
  process.env.NODE_ENV === 'production'
    ? resolve(__dirname, '../../common/envs/.env')
    : resolve(__dirname, '../../common/envs/development.env');

config({ path: envPath });

console.log({ env: process.env.DATABASE_HOST , envPath});

// ormconfig.js
module.exports = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  // seeds: [__dirname + '../typeorm/seeds/*.seed.ts'],
  // factories: [__dirname + '../typeorm/factories/*.ts'],
  entities: [__dirname +'../../api/**/*.entity.{ts,js}'],
  cli: {
    seed: {
      runMode: 'each',
    },
  },
  logging: true,
};
