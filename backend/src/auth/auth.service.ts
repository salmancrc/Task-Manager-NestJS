import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthDto } from './dto/create.auth.dto';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createAuthDto: CreateAuthDto) {
    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: createAuthDto.email,
        password: hashedPassword,
        name: createAuthDto.name,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async signin(signinDto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signinDto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(
      signinDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
    });

    return {
      accessToken: token,
    };
  }
}
