import { Body, Controller, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { RequestPayload } from './types/types';

@Controller('messages')
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Post()
    getHelloWorldMessage(@Body() params: RequestPayload) {
        return this.appService.getHelloWorldMessage(params.message);
    }
}
