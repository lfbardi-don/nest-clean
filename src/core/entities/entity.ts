import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export abstract class Entity<T> {
  private _id: UniqueEntityId;

  protected props: T;

  get id(): UniqueEntityId {
    return this._id;
  }

  protected constructor(props: T, id?: UniqueEntityId) {
    this.props = props;
    this._id = id ?? new UniqueEntityId();
  }

  public equals(other: Entity<T>): boolean {
    return other === this || other.id === this._id;
  }
}
