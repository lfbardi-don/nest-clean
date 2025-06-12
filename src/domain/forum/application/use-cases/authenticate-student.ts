import { StudentsRepository } from "../repositories/students-repository";
import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { HashComparator } from "@/domain/forum/application/cryptography/hash-comparator";
import { Encrypter } from "@/domain/forum/application/cryptography/encrypter";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

interface AuthenticateStudentUseCaseProps {
    email: string;
    password: string;
}

type AuthenticateStudentUseCaseResponse = Either<InvalidCredentialsError, { accessToken: string }>;

@Injectable()
export class AuthenticateStudentUseCase {
    constructor(
        private studentsRepository: StudentsRepository,
        private hashComparator: HashComparator,
        private encrypter: Encrypter,
    ) { }

    async execute({
        email,
        password,
    }: AuthenticateStudentUseCaseProps
    ): Promise<AuthenticateStudentUseCaseResponse> {
        const student = await this.studentsRepository.findByEmail(email);

        if (!student) {
            return left(new InvalidCredentialsError());
        }

        const passwordMatches = await this.hashComparator.compare(password, student.password);

        if (!passwordMatches) {
            return left(new InvalidCredentialsError());
        }

        const accessToken = await this.encrypter.encrypt({
            sub: student.id.toString(),
        });

        return right({ accessToken });
    }
}
