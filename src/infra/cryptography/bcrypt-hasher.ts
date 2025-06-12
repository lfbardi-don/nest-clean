import { HashComparator } from "@/domain/forum/application/cryptography/hash-comparator";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { hash, compare } from 'bcryptjs';

export class BcryptHasher implements HashGenerator, HashComparator {
    private readonly HASH_SALT_ROUNDS = 8;

    hash(value: string): Promise<string> {
        return hash(value, this.HASH_SALT_ROUNDS);
    }

    compare(value: string, hash: string): Promise<boolean> {
        return compare(value, hash);
    }
}