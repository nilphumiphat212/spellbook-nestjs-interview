import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthResponseData } from './dto/response/auth.response.dto';
import { BaseResponse } from '../core/base.response';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('sign_in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() authDto: AuthDto): Promise<BaseResponse<AuthResponseData>> {
    const data = await this.authService.signIn(authDto);

    return { success: data !== null, data };
  }

  @Post('sign_up')
  signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }
}
