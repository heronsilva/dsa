import { Decimal } from 'decimal.js';

export function fibTabulation(n: number): number {
    if (n < 2) return n;

    const fib = [0, 1, 1];

    for (let i = 3; i <= n; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
    }

    return fib[n];
}

export function fibTabulationDecimal(n: number): Decimal {
    if (n < 2) return new Decimal(n);

    const fib = [new Decimal(0), new Decimal(1), new Decimal(1)];

    for (let i = 3; i <= n; i++) {
        fib[i] = fib[i - 1].plus(fib[i - 2]);
    }

    return fib[n];
}
