import { Body, Controller, Post } from '@nestjs/common';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { AuthService } from './auth.service';
import { type SignInResponse } from './sign-in.types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() userCredentialsDto: UserCredentialsDto): Promise<string> {
    return this.authService.signUp(userCredentialsDto);
  }

  @Post('/signin')
  signin(
    @Body() userCredentialsDto: UserCredentialsDto,
  ): Promise<SignInResponse> {
    return this.authService.signIn(userCredentialsDto);
  }
}
