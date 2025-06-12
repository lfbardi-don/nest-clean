import { Module } from "@nestjs/common";
import { BcryptHasher } from "./bcrypt-hasher";
import { JwtEncrypter } from "./jwt-encrypter";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { HashComparator } from "@/domain/forum/application/cryptography/hash-comparator";
import { Encrypter } from "@/domain/forum/application/cryptography/encrypter";

@Module({
    providers: [
        { provide: HashGenerator, useClass: BcryptHasher },
        { provide: HashComparator, useClass: BcryptHasher },
        { provide: Encrypter, useClass: JwtEncrypter }
    ],
    exports: [
        HashGenerator,
        HashComparator,
        Encrypter
    ]
})
export class CryptographyModule { }
