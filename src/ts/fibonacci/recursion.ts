import { Decimal } from 'decimal.js';

export function fibRecursion(n: number): number {
    if (n < 2) return n;
    return fibRecursion(n - 1) + fibRecursion(n - 2);
}

export function fibRecursionDecimal(n: number): Decimal {
    if (n < 2) return new Decimal(n);
    return fibRecursionDecimal(n - 1).plus(fibRecursionDecimal(n - 2));
}
