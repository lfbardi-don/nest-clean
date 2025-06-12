export abstract class HashComparator {
    abstract compare(text: string, hash: string): Promise<boolean>
}