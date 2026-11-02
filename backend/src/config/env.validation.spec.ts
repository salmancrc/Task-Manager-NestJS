import 'reflect-metadata';
import { validateEnvironment } from './env.validation';

const requiredEnvironment = {
  DATABASE_URL: 'postgresql://ci:ci@localhost:5432/taskmanager',
  JWT_SECRET: 'ci-only-not-a-real-secret',
};

describe('validateEnvironment', () => {
  it('defaults Redis connection settings for local development', () => {
    const environment = validateEnvironment(requiredEnvironment);

    expect(environment.REDIS_HOST).toBe('localhost');
    expect(environment.REDIS_PORT).toBe(6379);
  });

  it('accepts custom Redis connection settings', () => {
    const environment = validateEnvironment({
      ...requiredEnvironment,
      REDIS_HOST: 'redis.example.com',
      REDIS_PORT: '6380',
    });

    expect(environment.REDIS_HOST).toBe('redis.example.com');
    expect(environment.REDIS_PORT).toBe(6380);
  });

  it('rejects invalid Redis ports', () => {
    expect(() =>
      validateEnvironment({
        ...requiredEnvironment,
        REDIS_PORT: '65536',
      }),
    ).toThrow('Invalid environment configuration');
  });

  it('defaults the frontend origin to localhost outside production', () => {
    expect(validateEnvironment(requiredEnvironment).FRONTEND_URL).toBe(
      'http://localhost:5173',
    );
  });

  it('requires a frontend origin in production', () => {
    expect(() =>
      validateEnvironment({
        ...requiredEnvironment,
        NODE_ENV: 'production',
        JWT_SECRET: 'a'.repeat(32),
      }),
    ).toThrow('FRONTEND_URL must be set in production');
  });

  it('normalizes and allows only an origin in production', () => {
    expect(
      validateEnvironment({
        ...requiredEnvironment,
        NODE_ENV: 'production',
        JWT_SECRET: 'a'.repeat(32),
        FRONTEND_URL: 'https://app.example.com/',
      }).FRONTEND_URL,
    ).toBe('https://app.example.com');

    expect(() =>
      validateEnvironment({
        ...requiredEnvironment,
        NODE_ENV: 'production',
        JWT_SECRET: 'a'.repeat(32),
        FRONTEND_URL: 'https://app.example.com/path',
      }),
    ).toThrow('FRONTEND_URL must be an origin without a path or query');
  });
});
