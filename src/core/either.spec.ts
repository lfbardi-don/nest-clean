import { Either, left, right } from "./either";

function doSomething(shouldFail: boolean): Either<string, number> {
    return shouldFail ? left('error') : right(1);
}

test('Right', () => {
    const right = doSomething(false);
    expect(right.value).toBe(1);
    expect(right.isRight()).toBe(true);
    expect(right.isLeft()).toBe(false);
});

test('Left', () => {
    const left = doSomething(true);
    expect(left.value).toBe('error');
    expect(left.isRight()).toBe(false);
    expect(left.isLeft()).toBe(true);
});
