export type SupportedCoins = 1 | 5 | 10 | 25 | 50 | 100;
export const SUPPORTED_COINS: Array<SupportedCoins> = [1, 5, 10, 25, 50, 100];

export interface Coin {
    value: SupportedCoins;
    quantity: number;
}

export const machineCoinStock: Coin[] = [
    { value: 1, quantity: 1 },
    { value: 5, quantity: 1 },
    { value: 10, quantity: 1 },
    { value: 25, quantity: 1 },
    { value: 50, quantity: 1 },
    { value: 100, quantity: 1 },
];

export class Product {
    constructor(
        public id: string,
        public name: string,
        public price: number,
        public stock: number
    ) {}
}

export const productMenu: Product[] = [
    new Product('1', 'Coca-Cola', 175, 10),
    new Product('2', 'Pepsi', 120, 5),
    new Product('3', 'Fanta', 130, 8),
    new Product('4', 'Sprite', 140, 2),
    new Product('5', 'Snickers', 95, 15),
    new Product('6', 'Twix', 85, 12),
    new Product('7', 'M&Ms', 110, 8),
    new Product('8', 'Doritos', 150, 6),
    new Product('9', 'Lays', 145, 7),
    new Product('10', 'KitKat', 90, 10),
    new Product('11', "Reese's", 100, 9),
    new Product('12', 'Skittles', 105, 11),
    new Product('13', 'Pringles', 160, 5),
    new Product('14', "Hershey's", 95, 8),
    new Product('15', 'Oreo', 120, 14),
    new Product('16', 'Cheetos', 135, 7),
];

function addCoinsToMachine(coins: Coin[]): void {
    for (const coin of coins) {
        const machineCoin = machineCoinStock.find((mCoin) => mCoin.value === coin.value);
        if (machineCoin) {
            machineCoin.quantity += coin.quantity;
        } else {
            machineCoinStock.push(coin);
        }
    }
}

function canFulfillChange(amount: number): boolean {
    const coinStockSortedDescending = machineCoinStock.sort((a, b) => b.value - a.value);
    let remainingChange = amount;

    for (const coin of coinStockSortedDescending) {
        if (remainingChange <= 0) break;

        const maxCoinsNeeded = Math.floor(remainingChange / coin.value);
        const coinsToUse = Math.min(maxCoinsNeeded, coin.quantity);

        remainingChange -= coinsToUse * coin.value;
    }

    return remainingChange === 0;
}

function calculateChange(amount: number): Coin[] {
    const coinStockSortedDescending = [...machineCoinStock].sort((a, b) => b.value - a.value);
    const changeCoinsMap: Map<SupportedCoins, number> = new Map();
    let remainingChange = amount;

    for (const coin of coinStockSortedDescending) {
        if (remainingChange <= 0) break;

        const maxCoinsNeeded = Math.floor(remainingChange / coin.value);
        const coinsToUse = Math.min(maxCoinsNeeded, coin.quantity);

        if (coinsToUse > 0) {
            remainingChange -= coinsToUse * coin.value;
            changeCoinsMap.set(coin.value, coinsToUse);
            coin.quantity -= coinsToUse;
        }
    }

    return Array.from(changeCoinsMap.entries()).map(([value, quantity]) => ({
        value,
        quantity,
    }));
}

export function buy(coinsInput: Coin[], productId: number): { product: Product; change: Coin[] } {
    if (!coinsInput.length) throw new Error('You need to insert coins');

    const totalInputValue = coinsInput.reduce((acc, coin) => {
        if (!SUPPORTED_COINS.includes(coin.value)) throw new Error(`Coin ${coin.value} is not allowed`);
        return acc + coin.value * coin.quantity;
    }, 0);
    const product = productMenu[productId];

    if (!product) throw new Error('Product not found');
    if (product.stock < 1) throw new Error('Product out of stock');
    if (totalInputValue < product.price) {
        throw new Error(`You need to insert more coins. ${product.price} - ${totalInputValue}`);
    }

    const changeAmount = totalInputValue - product.price;
    if (changeAmount > 0 && !canFulfillChange(changeAmount)) {
        throw new Error('Not enough coins in the machine to provide change');
    }

    addCoinsToMachine(coinsInput);

    const change = calculateChange(changeAmount);

    product.stock -= 1;

    return { product, change };
}
