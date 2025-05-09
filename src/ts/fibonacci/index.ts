import { fibIteration, fibIterationDecimal } from './iteration';
import { fibMemo, fibMemoDecimal } from './memoization';
import { assessPerformance } from './performance';
import { fibRecursion, fibRecursionDecimal } from './recursion';
import { fibTabulation, fibTabulationDecimal } from './tabulation';

// Test with a small number to compare all implementations
console.log('Testing with n = 10:');
assessPerformance(fibIteration, 10);
assessPerformance(fibIterationDecimal, 10);
assessPerformance(fibTabulation, 10);
assessPerformance(fibTabulationDecimal, 10);
assessPerformance(fibMemo, 10);
assessPerformance(fibMemoDecimal, 10);
assessPerformance(fibRecursion, 10);
assessPerformance(fibRecursionDecimal, 10);

// Test with a medium number (excluding recursive versions (to prevent stack overflow))
console.log('\nTesting with n = 50:');
assessPerformance(fibIteration, 50);
assessPerformance(fibIterationDecimal, 50);
assessPerformance(fibTabulation, 50);
assessPerformance(fibTabulationDecimal, 50);
assessPerformance(fibMemo, 50);
assessPerformance(fibMemoDecimal, 50);

// Test with a larger number (only iterative and tabulation)
console.log('\nTesting with n = 1000:');
assessPerformance(fibIteration, 1000);
assessPerformance(fibIterationDecimal, 1000);
assessPerformance(fibTabulation, 1000);
assessPerformance(fibTabulationDecimal, 1000);

// Test with a very large number (only Decimal versions of iterative and tabulation)
console.log('\nTesting with n = 1000000:');
assessPerformance(fibIterationDecimal, 1000000);
assessPerformance(fibTabulationDecimal, 1000000);
