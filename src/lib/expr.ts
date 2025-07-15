/**
 * Factory that returns a simple `$` helper for Datastar signals
 * Provides TypeScript safety without over-engineering
 */
export function Datastar<Signals>() {
    type SigObj = Partial<Signals>;

    // overload signatures
    interface $ {
        (strings: TemplateStringsArray, ...vals: unknown[]): string;          // tag for expressions
        (obj: SigObj): { "data-signals": string };                            // fn for data-signals
    }

    const fn = ((first: any, ...rest: any[]) => {
        // ① called as tagged template for expressions like $`counter`
        if (Array.isArray(first) && "raw" in first) {
            const raw = String.raw({ raw: first }, ...rest);
            return `$${raw}`;
        }

        // ② called as function with object for data-signals
        if (typeof first === "object" && first !== null) {
            return { "data-signals": JSON.stringify(first) };
        }

        throw new TypeError("Invalid $() usage");
    }) as unknown as $;

    return fn;
}