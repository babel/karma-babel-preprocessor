describe('TypeScript', (): void => {
    it('creates a Foo', (): void => {
        const foo: Foo = createFoo();
        expect(foo.bar).toBe(42);
        expect(foo.baz).toBe('hello world');
    });
});
