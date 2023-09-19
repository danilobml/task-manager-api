import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { type JwtPayload, type SignInResponse } from './sign-in.types';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(
    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {
    super(User, dataSource.createEntityManager());
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async createUser(userCredentialsDto: UserCredentialsDto): Promise<string> {
    const { username, password } = userCredentialsDto;
    const hashedPassword = await this.hashPassword(password);
    const newUser = this.create({
      username,
      password: hashedPassword,
    });
    try {
      await this.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
    return 'User succesfully created';
  }

  async signIn(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<SignInResponse> {
    const { username, password } = userCredentialsDto;
    const user = await this.findOneBy({ username });
    if (!user) throw new UnauthorizedException('User credentials incorrect');
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('User credentials incorrect');
    }
  }
}
