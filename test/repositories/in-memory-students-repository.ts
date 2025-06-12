import { DomainEvents } from '@/core/events/domain-events';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { Student } from '@/domain/forum/enterprise/entities/student';

export class InMemoryStudentsRepository implements StudentsRepository {
    public students: Student[] = [];

    async findByEmail(email: string): Promise<Student | null> {
        return this.students.find((s) => s.email === email) || null;
    }

    async create(student: Student): Promise<Student> {
        this.students.push(student);
        DomainEvents.dispatchEventsForAggregate(student.id);
        return student;
    }
}