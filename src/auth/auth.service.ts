import { Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseData } from './dto/response/auth.response.dto';
import { Config } from '../../config/config';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) { }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByUsername(username);

    if (user && compareSync(password, user.encryptedPassword)) {
      return user;
    }

    return null;
  }


  signUp({ username, password }: AuthDto) {
    const encryptedPassword = hashSync(password, SALT_ROUNDS);

    return this.usersService.create({ username, encryptedPassword });
  }

  async signIn({ username, password }: AuthDto): Promise<AuthResponseData | null> {
    const user = await this.validateUser(username, password);

    return user ? {
      username,
      accessToken: this.jwtService.sign({ username }, { secret: Config.jwt.secretKey })
    } : null;
  }
}
