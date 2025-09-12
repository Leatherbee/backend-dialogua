export default () => ({
  port: parseInt(process.env.PORT || '7575', 10),
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secretKey',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'dialogua',
  },
});
