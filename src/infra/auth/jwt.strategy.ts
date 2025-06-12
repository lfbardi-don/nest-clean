import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { EnvService } from "../env/env.service";
import { z } from "zod";
import { Injectable } from "@nestjs/common";

const tokenPayloadSchema = z.object({
    sub: z.string().uuid(),
});

export type JWTPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: EnvService) {
        const publicKey = config.get<string>("JWT_PUBLIC_KEY");

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(publicKey, "base64"),
            algorithms: ["RS256"],
        });
    }

    validate(payload: JWTPayload): JWTPayload {
        return tokenPayloadSchema.parse(payload);
    }
}