import { Decimal } from 'decimal.js';

export function fibIteration(n: number): number {
    if (n < 2) return n;

    let a = 1,
        b = 1;

    for (let i = 3; i <= n; i++) {
        const sum = a + b;
        a = b;
        b = sum;
    }

    return b;
}

export function fibIterationDecimal(n: number): Decimal {
    if (n < 2) return new Decimal(n);

    let a = new Decimal(1),
        b = new Decimal(1);

    for (let i = 3; i <= n; i++) {
        const sum = a.plus(b);
        a = b;
        b = sum;
    }

    return b;
}
