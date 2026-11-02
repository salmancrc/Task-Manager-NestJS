import { plainToInstance, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsIn(['development', 'production', 'test'])
  NODE_ENV = 'development';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT = 3000;

  @IsString()
  @IsNotEmpty()
  REDIS_HOST = 'localhost';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  REDIS_PORT = 6379;

  @IsString()
  @IsNotEmpty()
  @Matches(/^postgres(?:ql)?:\/\/.+/, {
    message: 'DATABASE_URL must be a valid PostgreSQL connection string',
  })
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  JWT_SECRET!: string;

  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  FRONTEND_URL?: string;
}

export function validateEnvironment(config: Record<string, unknown>) {
  const environment = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(environment, { skipMissingProperties: false });

  if (errors.length > 0) {
    const messages = errors.flatMap((error) =>
      Object.values(error.constraints ?? {}),
    );
    throw new Error(
      `Invalid environment configuration: ${messages.join('; ')}`,
    );
  }

  if (
    environment.NODE_ENV === 'production' &&
    environment.JWT_SECRET.length < 32
  ) {
    throw new Error('JWT_SECRET must be at least 32 characters in production');
  }

  if (environment.NODE_ENV === 'production' && !environment.FRONTEND_URL) {
    throw new Error('FRONTEND_URL must be set in production');
  }

  const frontendUrl = new URL(
    environment.FRONTEND_URL ?? 'http://localhost:5173',
  );
  if (frontendUrl.pathname !== '/' || frontendUrl.search || frontendUrl.hash) {
    throw new Error('FRONTEND_URL must be an origin without a path or query');
  }

  return {
    ...config,
    ...environment,
    FRONTEND_URL: frontendUrl.origin,
  };
}
