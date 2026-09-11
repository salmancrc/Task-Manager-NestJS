import { Exclude } from 'class-transformer';

// This class acts as a "safe" version of the User database model.
// When a response passes through ClassSerializerInterceptor,
// any field decorated with @Exclude() is automatically stripped from the output.
export class UserEntity {
  id: number;
  email: string;
  name: string | null;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
