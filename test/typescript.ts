interface Foo {
    bar: number;
    baz: string;
}

function createFoo(): Foo {
    return {
        bar: 42,
        baz: 'hello world'
    };
}
