import {
  cryptocurrencies,
  fiatCurrencies,
  fetchCryptocurrenciesFromApi,
} from "../cryptoData";

describe("cryptoData", () => {
  const originalEnv = process.env.EXPO_PUBLIC_COINGECKO_API_KEY;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env.EXPO_PUBLIC_COINGECKO_API_KEY = originalEnv;
  });

  it("deve conter dados estáticos válidos para cryptocurrencies e fiatCurrencies", () => {
    // Assert
    expect(cryptocurrencies.length).toBeGreaterThan(0);
    expect(cryptocurrencies[0]).toHaveProperty("id");
    expect(cryptocurrencies[0]).toHaveProperty("price");

    expect(fiatCurrencies.length).toBeGreaterThan(0);
    expect(fiatCurrencies[0]).toHaveProperty("code");
    expect(fiatCurrencies[0]).toHaveProperty("rate");
  });

  it("deve buscar criptomoedas com sucesso da API quando response.ok for true", async () => {
    // Arrange
    const mockApiResponse = [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "btc",
        current_price: 65000,
        price_change_percentage_24h: 2.5,
        image: "https://image.url/btc.png",
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "eth",
        current_price: 3500,
        price_change_percentage_24h: null,
        image: "https://image.url/eth.png",
      },
    ];

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValueOnce(mockApiResponse),
    });

    // Act
    const result = await fetchCryptocurrenciesFromApi();

    // Assert
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 65000,
      change24h: 2.5,
      image: "https://image.url/btc.png",
    });
    // Verifica fallback de change24h para 0 quando null
    expect(result[1].change24h).toBe(0);
    expect(result[1].symbol).toBe("ETH");
  });

  it("deve incluir header de API key quando configurada no ambiente", async () => {
    // Arrange
    process.env.EXPO_PUBLIC_COINGECKO_API_KEY = "test-api-key";

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValueOnce([]),
    });

    // Act
    await fetchCryptocurrenciesFromApi();

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.coingecko.com/api/v3/coins/markets"),
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-cg-demo-api-key": "test-api-key",
        }),
      })
    );
  });

  it("deve lançar erro quando a resposta da API não for ok", async () => {
    // Arrange
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    // Act & Assert
    await expect(fetchCryptocurrenciesFromApi()).rejects.toThrow(
      "Failed to fetch cryptocurrencies: 500"
    );
  });
});
