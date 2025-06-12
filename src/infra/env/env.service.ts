import { ConfigService } from "@nestjs/config";
import { Env } from "../env/env";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EnvService {
    constructor(private configService: ConfigService<Env, true>) { }

    get<T>(key: keyof Env): T {
        return this.configService.get(key, { infer: true });
    }
}
