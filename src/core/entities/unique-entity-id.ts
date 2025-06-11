import { randomUUID } from 'node:crypto';

export class UniqueEntityId {
  private value: string;

  toString(): string {
    return this.value;
  }

  toValue(): string {
    return this.value;
  }

  equals(other: UniqueEntityId): boolean {
    return other.value === this.value;
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }
}
