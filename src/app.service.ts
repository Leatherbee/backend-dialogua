import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationsAppService {
  getHello(): string {
    return 'Hello World!';
  }
}
