import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { SignInResponse } from './sign-in.types';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}

  async signUp(userCredentialsDto: UserCredentialsDto): Promise<string> {
    return await this.usersRepository.createUser(userCredentialsDto);
  }

  async signIn(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<SignInResponse> {
    return await this.usersRepository.signIn(userCredentialsDto);
  }
}
