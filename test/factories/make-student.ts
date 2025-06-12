import { StudentProps, Student } from "@/domain/forum/enterprise/entities/student";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { faker } from '@faker-js/faker';

export function makeStudent(override: Partial<StudentProps> = {}, id?: UniqueEntityId) {
    return Student.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        ...override,
    }, id);
}