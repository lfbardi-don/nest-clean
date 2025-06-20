import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { EnvService } from "../env/env.service";
import { JwtStrategy } from "./jwt.strategy";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { EnvModule } from "../env/env.module";

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [EnvModule],
            inject: [EnvService],
            global: true,
            useFactory: (envService: EnvService) => {
                const privateKey = envService.get<string>('JWT_PRIVATE_KEY');
                const publicKey = envService.get<string>('JWT_PUBLIC_KEY');

                return {
                    privateKey: Buffer.from(privateKey, 'base64'),
                    publicKey: Buffer.from(publicKey, 'base64'),
                    signOptions: {
                        algorithm: 'RS256',
                    },
                };
            }
        }),
    ],
    providers: [
        JwtStrategy,
        EnvService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AuthModule { }