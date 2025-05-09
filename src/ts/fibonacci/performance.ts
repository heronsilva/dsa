import { Decimal } from 'decimal.js';

interface PerformanceMetrics {
    functionName: string;
    input: number;
    result: number | Decimal;
    executionTime: number;
    memoryUsage?: number;
}

export function assessPerformanceSimple(fn: (n: number) => number | Decimal, n: number) {
    const start = performance.now();
    const result = fn(n);
    const end = performance.now();
    console.log(`${fn.name}(${n}) = ${result}, Time: ${end - start}ms`);
}

export function assessPerformance(
    fn: (n: number) => number | Decimal,
    n: number,
    options: { logMemory?: boolean } = { logMemory: true }
): PerformanceMetrics {
    const start = performance.now();
    const result = fn(n);
    const end = performance.now();

    const metrics: PerformanceMetrics = {
        functionName: fn.name,
        input: n,
        result,
        executionTime: end - start,
    };

    if (options.logMemory && process.memoryUsage) {
        const memoryUsage = process.memoryUsage();
        metrics.memoryUsage = memoryUsage.heapUsed / 1024 / 1024; // Convert to MB
    }

    // Format the output
    const resultStr = result instanceof Decimal ? result.toString() : result;
    console.log(`
Function: ${metrics.functionName}
Input: ${metrics.input}
Result: ${resultStr}
Execution Time: ${metrics.executionTime.toFixed(3)}ms
${metrics.memoryUsage ? `Memory Usage: ${metrics.memoryUsage.toFixed(2)}MB` : ''}
-------------------`);

    return metrics;
}
