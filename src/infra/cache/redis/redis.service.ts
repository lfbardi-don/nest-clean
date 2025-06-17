import { EnvService } from '@/infra/env/env.service'
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
    constructor(envService: EnvService) {
        super({
            host: envService.get<string>('REDIS_HOST'),
            port: envService.get<number>('REDIS_PORT'),
            db: envService.get<number>('REDIS_DB'),
        })
    }

    onModuleDestroy() {
        return this.disconnect()
    }
}