import * as AlertContextModule from "@context/AlertProvider/useAlertProvider";
import type { Cryptocurrency } from "@data/cryptoData";
import { act, fireEvent, render, renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import { CryptoCard } from "../CryptoCard";
import { useCryptoCard } from "../useCryptoCard";

describe("CryptoCard & useCryptoCard", () => {
  const mockCryptoPositive: Cryptocurrency = {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 65000,
    change24h: 2.5,
    image: "https://example.com/btc.png",
  };

  const mockCryptoNegative: Cryptocurrency = {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 3500,
    change24h: -1.5,
  };

  const mockAlerts: AlertContextModule.PriceAlert[] = [
    {
      id: "alert-1",
      cryptocurrency: "Bitcoin",
      symbol: "BTC",
      targetPrice: 70000,
      condition: "above",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useCryptoCard", () => {
    it("deve detectar variação positiva e alertas associados à moeda", async () => {
      // Arrange
      jest.spyOn(AlertContextModule, "useAlerts").mockReturnValue({
        alerts: mockAlerts,
        addAlert: jest.fn(),
        deleteAlert: jest.fn(),
      });

      // Act
      const { result } = await renderHook(() =>
        useCryptoCard(mockCryptoPositive)
      );

      // Assert
      expect(result.current.isPositive).toBe(true);
      expect(result.current.hasAlert).toBe(true);
      expect(result.current.alertsForCrypto).toHaveLength(1);
      expect(result.current.expanded).toBe(false);

      // Act - toggleExpanded
      await act(async () => {
        result.current.toggleExpanded();
      });

      // Assert
      expect(result.current.expanded).toBe(true);
    });

    it("não deve alternar expanded quando não houver alertas", async () => {
      // Arrange
      jest.spyOn(AlertContextModule, "useAlerts").mockReturnValue({
        alerts: [],
        addAlert: jest.fn(),
        deleteAlert: jest.fn(),
      });

      // Act
      const { result } = await renderHook(() =>
        useCryptoCard(mockCryptoNegative)
      );

      // Assert
      expect(result.current.isPositive).toBe(false);
      expect(result.current.hasAlert).toBe(false);

      // Act - toggleExpanded sem alertas
      await act(async () => {
        result.current.toggleExpanded();
      });

      // Assert
      expect(result.current.expanded).toBe(false);
    });
  });

  describe("CryptoCard component", () => {
    it("deve renderizar informações da moeda e expandir lista de alertas ao clicar no badge", async () => {
      // Arrange
      jest.spyOn(AlertContextModule, "useAlerts").mockReturnValue({
        alerts: mockAlerts,
        addAlert: jest.fn(),
        deleteAlert: jest.fn(),
      });

      // Act
      const { getByText, getByRole, queryByText } = await render(
        <CryptoCard crypto={mockCryptoPositive} />
      );

      // Assert
      expect(getByText("Bitcoin")).toBeTruthy();
      expect(getByText("BTC")).toBeTruthy();
      expect(getByText("$65,000.00")).toBeTruthy();
      expect(getByText("+2.50%")).toBeTruthy();
      expect(getByText("1 alert")).toBeTruthy();

      // Antes do clique, a lista interna de alertas não deve aparecer
      expect(queryByText("Above target")).toBeNull();

      // Act - Clicar no badge de alertas
      const toggleBtn = getByRole("button");
      await act(async () => {
        fireEvent.press(toggleBtn);
      });

      // Assert
      await waitFor(() => {
        expect(getByText("Above target")).toBeTruthy();
        expect(getByText("$70,000.00")).toBeTruthy();
      });
    });

    it("deve renderizar fallback de letra inicial quando imagem não for fornecida", async () => {
      // Arrange
      jest.spyOn(AlertContextModule, "useAlerts").mockReturnValue({
        alerts: [],
        addAlert: jest.fn(),
        deleteAlert: jest.fn(),
      });

      // Act
      const { getByText } = await render(
        <CryptoCard crypto={mockCryptoNegative} />
      );

      // Assert
      expect(getByText("E")).toBeTruthy();
      expect(getByText("-1.50%")).toBeTruthy();
    });
  });
});
