import { StudentProps, Student } from "@/domain/forum/enterprise/entities/student";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { faker } from '@faker-js/faker';
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaStudentMapper } from "@/infra/database/prisma/mappers/prisma-student-mapper";

export function makeStudent(override: Partial<StudentProps> = {}, id?: UniqueEntityId) {
    return Student.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        ...override,
    }, id);
}

@Injectable()
export class StudentFactory {
    constructor(private prisma: PrismaService) { }

    async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
        const student = makeStudent(data);

        await this.prisma.user.create({
            data: PrismaStudentMapper.toPrisma(student),
        });

        return student;
    }
}