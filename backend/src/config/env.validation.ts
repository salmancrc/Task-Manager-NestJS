import { plainToInstance, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsString,
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
  @Matches(/^postgres(?:ql)?:\/\/.+/)
  DATABASE_URL!: string;

  @IsString()
  @MinLength(1)
  JWT_SECRET!: string;
}

export function validateEnvironment(config: Record<string, unknown>) {
  const environment = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(environment);

  if (errors.length > 0) {
    const messages = errors.flatMap((error) =>
      Object.values(error.constraints ?? {}),
    );
    throw new Error(`Invalid environment configuration: ${messages.join('; ')}`);
  }

  if (environment.NODE_ENV === 'production' && environment.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production');
  }

  return { ...config, NODE_ENV: environment.NODE_ENV, PORT: environment.PORT };
}