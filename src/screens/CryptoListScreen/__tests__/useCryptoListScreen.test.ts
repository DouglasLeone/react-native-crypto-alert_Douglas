import * as cryptoData from "@data/cryptoData";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useCryptoListScreen } from "../useCryptoListScreen";

describe("useCryptoListScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve carregar os dados com sucesso e definir o estado como idle", async () => {
    // Arrange
    const mockList: cryptoData.Cryptocurrency[] = [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        price: 70000,
        change24h: 3.5,
      },
    ];
    jest
      .spyOn(cryptoData, "fetchCryptocurrenciesFromApi")
      .mockResolvedValueOnce(mockList);

    // Act
    const { result } = await renderHook(() => useCryptoListScreen());

    // Assert
    await waitFor(() => {
      expect(result.current.loadingState).toBe("idle");
      expect(result.current.cryptocurrencies).toEqual(mockList);
    });
  });

  it("deve definir o estado como empty quando a API retornar lista vazia", async () => {
    // Arrange
    jest
      .spyOn(cryptoData, "fetchCryptocurrenciesFromApi")
      .mockResolvedValueOnce([]);

    // Act
    const { result } = await renderHook(() => useCryptoListScreen());

    // Assert
    await waitFor(() => {
      expect(result.current.loadingState).toBe("empty");
      expect(result.current.cryptocurrencies).toEqual([]);
    });
  });

  it("deve tratar erros de requisição, manter fallbacks e definir estado como error", async () => {
    // Arrange
    jest
      .spyOn(cryptoData, "fetchCryptocurrenciesFromApi")
      .mockRejectedValueOnce(new Error("API offline"));

    // Act
    const { result } = await renderHook(() => useCryptoListScreen());

    // Assert
    await waitFor(() => {
      expect(result.current.loadingState).toBe("error");
      expect(result.current.cryptocurrencies).toEqual(
        cryptoData.cryptocurrencies
      );
    });
  });

  it("deve permitir tentar novamente via handleRetry", async () => {
    // Arrange
    const fetchSpy = jest
      .spyOn(cryptoData, "fetchCryptocurrenciesFromApi")
      .mockRejectedValueOnce(new Error("First attempt fail"))
      .mockResolvedValueOnce([
        {
          id: "ethereum",
          name: "Ethereum",
          symbol: "ETH",
          price: 3500,
          change24h: 1.2,
        },
      ]);

    const { result } = await renderHook(() => useCryptoListScreen());

    await waitFor(() => {
      expect(result.current.loadingState).toBe("error");
    });

    // Act - Retry
    await act(async () => {
      result.current.handleRetry();
    });

    // Assert
    await waitFor(() => {
      expect(result.current.loadingState).toBe("idle");
      expect(result.current.cryptocurrencies[0].symbol).toBe("ETH");
    });
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});
