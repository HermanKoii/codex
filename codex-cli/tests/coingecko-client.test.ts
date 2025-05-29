import { describe, it, expect, afterEach } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { CoinGeckoClient } from '../src/utils/coingecko-client';

describe('CoinGeckoClient', () => {
  const mock = new MockAdapter(axios);
  const client = new CoinGeckoClient();

  afterEach(() => {
    mock.reset();
  });

  describe('getCoinPrices', () => {
    it('should fetch coin prices successfully', async () => {
      const mockResponse = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: 50000,
          market_cap: 1000000000000
        }
      ];

      mock.onGet('https://api.coingecko.com/api/v3/coins/markets').reply(200, mockResponse);

      const prices = await client.getCoinPrices(['bitcoin']);
      expect(prices).toEqual(mockResponse);
      expect(prices[0].id).toBe('bitcoin');
      expect(prices[0].current_price).toBe(50000);
    });

    it('should handle network errors', async () => {
      mock.onGet('https://api.coingecko.com/api/v3/coins/markets').reply(500);

      await expect(client.getCoinPrices(['bitcoin'])).rejects.toThrow();
    });
  });

  describe('getCoinPrice', () => {
    it('should fetch a single coin price', async () => {
      const mockResponse = [
        {
          id: 'ethereum',
          symbol: 'eth',
          name: 'Ethereum',
          current_price: 3000,
          market_cap: 500000000000
        }
      ];

      mock.onGet('https://api.coingecko.com/api/v3/coins/markets').reply(200, mockResponse);

      const price = await client.getCoinPrice('ethereum');
      expect(price).toEqual(mockResponse[0]);
    });

    it('should return null for non-existent coin', async () => {
      mock.onGet('https://api.coingecko.com/api/v3/coins/markets').reply(200, []);

      const price = await client.getCoinPrice('nonexistent-coin');
      expect(price).toBeNull();
    });
  });

  describe('getSupportedCurrencies', () => {
    it('should fetch supported currencies', async () => {
      const mockResponse = ['usd', 'eur', 'gbp', 'jpy'];

      mock.onGet('https://api.coingecko.com/api/v3/simple/supported_vs_currencies').reply(200, mockResponse);

      const currencies = await client.getSupportedCurrencies();
      expect(currencies).toEqual(mockResponse);
    });

    it('should handle network errors for supported currencies', async () => {
      mock.onGet('https://api.coingecko.com/api/v3/simple/supported_vs_currencies').reply(500);

      await expect(client.getSupportedCurrencies()).rejects.toThrow();
    });
  });
});