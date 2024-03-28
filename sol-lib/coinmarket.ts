import axios from 'axios';

export async function getSolToUsdExchangeRate(): Promise<number> {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const exchangeRate = response.data.solana.usd;
        return exchangeRate;
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        return 0; // Return 0 or handle the error as needed
    }
}
