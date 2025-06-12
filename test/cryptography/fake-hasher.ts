import { HashComparator } from "@/domain/forum/application/cryptography/hash-comparator";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";

export class FakeHasher implements HashGenerator, HashComparator {
    async hash(text: string): Promise<string> {
        return text.concat('-hashed')
    }

    async compare(text: string, hash: string): Promise<boolean> {
        return text.concat('-hashed') === hash
    }
}