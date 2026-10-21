import * as cryptoData from "@data/cryptoData";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useConversionScreen } from "../useConversionScreen";

describe("useConversionScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve inicializar com valores padrão e estado de placeholder ativo", async () => {
    // Arrange & Act
    const { result } = await renderHook(() => useConversionScreen());

    // Assert
    expect(result.current.amount).toBe("");
    expect(result.current.selectedCrypto).toBe("bitcoin");
    expect(result.current.selectedFiat).toBe("USD");
    expect(result.current.showPlaceholder).toBe(true);
    expect(result.current.showInvalid).toBe(false);
    expect(result.current.formattedResult).toBeNull();
    expect(result.current.cryptoOptions.length).toBeGreaterThan(0);
    expect(result.current.fiatOptions.length).toBeGreaterThan(0);
  });

  it("deve carregar cryptos da API se a chamada tiver sucesso", async () => {
    // Arrange
    const mockCryptos: cryptoData.Cryptocurrency[] = [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        price: 50000,
        change24h: 1.5,
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        price: 3000,
        change24h: -0.5,
      },
    ];
    jest
      .spyOn(cryptoData, "fetchCryptocurrenciesFromApi")
      .mockResolvedValueOnce(mockCryptos);

    // Act
    const { result } = await renderHook(() => useConversionScreen());

    // Assert
    await waitFor(() => {
      expect(result.current.cryptoOptions).toEqual([
        { value: "bitcoin", title: "Bitcoin", subtitle: "BTC" },
        { value: "ethereum", title: "Ethereum", subtitle: "ETH" },
      ]);
    });
  });

  it("deve manter fallbackCryptos se a API falhar", async () => {
    // Arrange
    jest
      .spyOn(cryptoData, "fetchCryptocurrenciesFromApi")
      .mockRejectedValueOnce(new Error("Network Error"));

    // Act
    const { result } = await renderHook(() => useConversionScreen());

    // Assert
    await waitFor(() => {
      expect(result.current.cryptoOptions.length).toBe(
        cryptoData.cryptocurrencies.length
      );
    });
  });

  it("deve calcular a conversão corretamente para valores válidos", async () => {
    // Arrange
    const { result } = await renderHook(() => useConversionScreen());

    // Act - Converter 2 Bitcoins em USD
    await act(async () => {
      result.current.setAmount("2");
    });

    // Assert
    await waitFor(() => {
      expect(result.current.showPlaceholder).toBe(false);
      expect(result.current.showInvalid).toBe(false);
      expect(result.current.formattedResult).not.toBeNull();
    });

    const bitcoin = cryptoData.cryptocurrencies.find((c) => c.id === "bitcoin")!;
    const expectedUsdPrice = (2 * bitcoin.price).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    expect(result.current.formattedResult).toBe(`$${expectedUsdPrice}`);
  });

  it("deve atualizar a conversão ao mudar a moeda fiduciária para BRL", async () => {
    // Arrange
    const { result } = await renderHook(() => useConversionScreen());

    // Act
    await act(async () => {
      result.current.setAmount("1");
      result.current.setSelectedFiat("BRL");
    });

    // Assert
    const bitcoin = cryptoData.cryptocurrencies.find((c) => c.id === "bitcoin")!;
    const brlCurrency = cryptoData.fiatCurrencies.find((f) => f.code === "BRL")!;
    const expectedBrl = (1 * bitcoin.price * brlCurrency.rate).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    await waitFor(() => {
      expect(result.current.formattedResult).toBe(`R$${expectedBrl}`);
    });
  });

  it("deve atualizar a conversão ao mudar a criptomoeda para ethereum", async () => {
    // Arrange
    const { result } = await renderHook(() => useConversionScreen());

    // Act
    await act(async () => {
      result.current.setAmount("1");
      result.current.setSelectedCrypto("ethereum");
    });

    // Assert
    const ethereum = cryptoData.cryptocurrencies.find((c) => c.id === "ethereum")!;
    const expectedUsd = (1 * ethereum.price).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    await waitFor(() => {
      expect(result.current.formattedResult).toBe(`$${expectedUsd}`);
    });
  });

  it("deve indicar input inválido para valores não numéricos", async () => {
    // Arrange
    const { result } = await renderHook(() => useConversionScreen());

    // Act
    await act(async () => {
      result.current.setAmount("invalid-text");
    });

    // Assert
    expect(result.current.showPlaceholder).toBe(false);
    expect(result.current.showInvalid).toBe(true);
    expect(result.current.formattedResult).toBeNull();
  });

  it("deve indicar input inválido para números negativos ou zero", async () => {
    // Arrange
    const { result } = await renderHook(() => useConversionScreen());

    // Act - zero
    await act(async () => {
      result.current.setAmount("0");
    });

    // Assert
    expect(result.current.showInvalid).toBe(true);
    expect(result.current.formattedResult).toBeNull();

    // Act - negativo
    await act(async () => {
      result.current.setAmount("-10");
    });

    // Assert
    expect(result.current.showInvalid).toBe(true);
    expect(result.current.formattedResult).toBeNull();
  });
});
