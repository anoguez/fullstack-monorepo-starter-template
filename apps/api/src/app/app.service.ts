import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { Message } from './types/types';

@Injectable()
export class AppService {
    getHelloWorldMessage(params: Message): { content: string; type: 'user' | 'bot', id: number } {
        console.log(params);
        return { 
            id: randomInt(1000), 
            type: 'bot', 
            content: `Hello World, Human! This is a reply for your message: ${params.content}`, 
        };
    }
}
