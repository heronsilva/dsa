import { Decimal } from 'decimal.js';

export function fibMemo(n: number, memo: Record<number, number> = {}): number {
    if (n in memo) return memo[n];
    if (n <= 2) return 1;

    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}

export function fibMemoDecimal(n: number, memo: Record<number, Decimal> = {}): Decimal {
    if (n in memo) return memo[n];
    if (n <= 2) return new Decimal(1);

    memo[n] = fibMemoDecimal(n - 1, memo).plus(fibMemoDecimal(n - 2, memo));
    return memo[n];
}
