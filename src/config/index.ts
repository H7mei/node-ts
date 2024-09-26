import merge from 'lodash.merge';
import path from 'path';
import * as dotenv from 'dotenv';

// Load .env file based on NODE_ENV
const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : process.env.NODE_ENV === 'testing'
    ? '.env.staging'
    : '.env.development';

const envFilePath = path.resolve(__dirname, '..', '..', envFile);

dotenv.config({path: envFilePath});

// make sure NODE_ENV is set
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const stage = process.env.STAGE || 'local';
let envConfig;

// dynamically require each config depending on the stage we're in
if (stage === 'production') {
  envConfig = require('./prod').default;
} else if (stage === 'staging') {
  envConfig = require('./staging').default;
} else {
  envConfig = require('./local').default;
}

const defaultConfig = {
  stage,
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT,
  logging: false,
};

export default merge(defaultConfig, envConfig);
