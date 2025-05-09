import { select, input } from '@inquirer/prompts';

import { buy, Coin, productMenu, SUPPORTED_COINS, SupportedCoins } from './machine';

function displayProductGrid() {
    return productMenu.map((product, index) => ({
        name: `${product.name} (¢${product.price}) - Stock: ${product.stock}`,
        value: index,
    }));
}

function validateCoinInput(input: string) {
    return (
        input
            .split(',')
            .map((v) => parseInt(v.trim()) as SupportedCoins)
            .every((v) => SUPPORTED_COINS.includes(v)) || 'Please enter valid coin values'
    );
}

async function getCoinInput(): Promise<Coin[]> {
    const coinsInput = await input({
        message: 'Enter coins (comma-separated values, e.g., "50,25,10"):',
        validate: validateCoinInput,
    });

    const coinCounts = new Map<SupportedCoins, number>();
    coinsInput.split(',').forEach((coin: string) => {
        const value = parseInt(coin.trim()) as SupportedCoins;
        coinCounts.set(value, (coinCounts.get(value) || 0) + 1);
    });

    return Array.from(coinCounts.entries()).map(([value, quantity]) => ({
        value,
        quantity,
    }));
}

async function main() {
    try {
        console.log('Welcome to the Vending Machine!');

        const productId = await select({
            message: 'Select a product:',
            choices: displayProductGrid(),
        });

        const coins = await getCoinInput();
        const result = buy(coins, productId);

        console.log('Transaction successful!');
        console.log(`You bought: ${result.product.name}`);
        console.log('Change received:');

        result.change.forEach((coin) => console.log(`${coin.quantity} x ${coin.value}¢`));
    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'An unknown error occurred');
    }
}

main();
