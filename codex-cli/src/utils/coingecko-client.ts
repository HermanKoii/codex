import axios from 'axios';

export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
}

export class CoinGeckoClient {
  private baseUrl = 'https://api.coingecko.com/api/v3';

  async getCoinPrices(
    coins: string[], 
    currency = 'usd', 
    perPage = 100, 
    page = 1
  ): Promise<CoinPrice[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/coins/markets`, {
        params: {
          vs_currency: currency,
          ids: coins.join(','),
          order: 'market_cap_desc',
          per_page: perPage,
          page: page,
          sparkline: false
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching coin prices:', error);
      throw error;
    }
  }

  async getCoinPrice(
    coinId: string, 
    currency = 'usd'
  ): Promise<CoinPrice | null> {
    try {
      const prices = await this.getCoinPrices([coinId], currency);
      return prices.length > 0 ? prices[0] : null;
    } catch (error) {
      console.error(`Error fetching price for ${coinId}:`, error);
      return null;
    }
  }

  async getSupportedCurrencies(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/simple/supported_vs_currencies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching supported currencies:', error);
      throw error;
    }
  }
}