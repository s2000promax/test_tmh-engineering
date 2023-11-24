import * as process from 'process';

export default () => ({
  port: parseInt(process.env.VERCEL_PORT, 10) || 8002,
  origins: [
    process.env.VERCEL_REMOTE_ORIGIN_1,
    process.env.VERCEL_REMOTE_ORIGIN_2,
    process.env.VERCEL_REMOTE_ORIGIN_3,
    process.env.VERCEL_LOCAL_ORIGIN_1,
    process.env.VERCEL_LOCAL_ORIGIN_2,
    process.env.VERCEL_LOCAL_ORIGIN_3,
  ],
  allowedHeaders: [
    'content-type',
    'Access-Control-Allow-Credentials',
    'Origin',
    'X-Requested-With',
    'Authorization',
    'Accept',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
});
