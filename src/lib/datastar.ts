// Flatten nested object keys into dot notation
type DotPaths<T, P extends string = ""> = {
    [K in keyof T]:
    T[K] extends object
    ? DotPaths<T[K], `${P}${K & string}.`>
    : `${P}${K & string}`
}[keyof T];

// Extract variables prefixed by $ from a template string
type ExtractVars<S extends string> =
    S extends `${string}$${infer Var}.${infer Rest}`
    ? Var | `${Var}.${ExtractVars<Rest>}`
    : S extends `$${infer Var}.${infer Rest}`
    ? Var | `${Var}.${ExtractVars<Rest>}`
    : S extends `${string}$${infer Var}${infer Rest}`
    ? Var | ExtractVars<Rest>
    : S extends `$${infer Var}${infer Rest}`
    ? Var | ExtractVars<Rest>
    : never;

// Validate that all extracted variables are valid keys
type ValidateExpr<S extends string, Paths extends string> =
    ExtractVars<S> extends infer V
    ? Exclude<V, Paths> extends never
    ? S
    : never
    : never;

// The main factory
export function Datastar<T>() {
    type ValidPaths = DotPaths<T>;

    function handler(input: T): { "data-signals": string };
    function handler<S extends string>(template: ValidateExpr<S, ValidPaths>): S;
    function handler(strings: TemplateStringsArray, ...values: any[]): string;
    function handler(arg: any, ...values: any[]): any {
        if (Array.isArray(arg) && 'raw' in arg) {
            // Tagged template literal - convert to string
            return arg.join('');
        }
        if (typeof arg === "string") {
            return arg; // String template input (already validated at type level)
        }
        return { "data-signals": JSON.stringify(arg) }; // Object input
    }

    return handler;
}
