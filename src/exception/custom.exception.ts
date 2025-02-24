import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(message: string) {
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      message: message || 'Bad Request', // Default message if none provided
    }, HttpStatus.BAD_REQUEST);
  }
}