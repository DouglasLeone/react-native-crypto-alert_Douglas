import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import { AlertProvider } from "../AlertProvider";
import {
  useAlertProviderState,
  useAlerts,
  type PriceAlert,
} from "../useAlertProvider";

describe("AlertProvider & useAlertProvider", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  describe("useAlerts fora do Provider", () => {
    it("deve lançar erro quando useAlerts for chamado fora do AlertProvider", async () => {
      // Arrange & Act & Assert
      await expect(async () => {
        await renderHook(() => useAlerts());
      }).rejects.toThrow("useAlerts must be used within AlertProvider");
    });
  });

  describe("useAlertProviderState", () => {
    it("deve inicializar com lista vazia se não houver dados no AsyncStorage", async () => {
      // Arrange
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      // Act
      const { result } = await renderHook(() => useAlertProviderState());

      // Assert
      await waitFor(() => {
        expect(result.current).not.toBeNull();
        expect(result.current.alerts).toEqual([]);
      });
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("cryptoAlerts");
    });

    it("deve hidratar os alertas salvos previamente no AsyncStorage", async () => {
      // Arrange
      const mockSavedAlerts: PriceAlert[] = [
        {
          id: "alert-1",
          cryptocurrency: "Bitcoin",
          symbol: "BTC",
          targetPrice: 70000,
          condition: "above",
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockSavedAlerts)
      );

      // Act
      const { result } = await renderHook(() => useAlertProviderState());

      // Assert
      await waitFor(() => {
        expect(result.current).not.toBeNull();
        expect(result.current.alerts).toHaveLength(1);
        expect(result.current.alerts[0].symbol).toBe("BTC");
      });
    });

    it("deve adicionar novo alerta e persistir no AsyncStorage", async () => {
      // Arrange
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const { result } = await renderHook(() => useAlertProviderState());

      await waitFor(() => {
        expect(result.current).not.toBeNull();
        expect(result.current.alerts).toEqual([]);
      });

      // Act
      await act(async () => {
        result.current.addAlert({
          cryptocurrency: "Ethereum",
          symbol: "ETH",
          targetPrice: 4000,
          condition: "below",
        });
      });

      // Assert
      await waitFor(() => {
        expect(result.current.alerts).toHaveLength(1);
      });

      const added = result.current.alerts[0];
      expect(added.cryptocurrency).toBe("Ethereum");
      expect(added.symbol).toBe("ETH");
      expect(added.targetPrice).toBe(4000);
      expect(added.condition).toBe("below");
      expect(added.id).toBeDefined();
      expect(added.createdAt).toBeDefined();

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          "cryptoAlerts",
          expect.stringContaining("Ethereum")
        );
      });
    });

    it("deve remover alerta pelo id e atualizar o AsyncStorage", async () => {
      // Arrange
      const initialAlerts: PriceAlert[] = [
        {
          id: "alert-123",
          cryptocurrency: "Solana",
          symbol: "SOL",
          targetPrice: 150,
          condition: "above",
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(initialAlerts)
      );

      const { result } = await renderHook(() => useAlertProviderState());

      await waitFor(() => {
        expect(result.current).not.toBeNull();
        expect(result.current.alerts).toHaveLength(1);
      });

      // Act
      await act(async () => {
        result.current.deleteAlert("alert-123");
      });

      // Assert
      await waitFor(() => {
        expect(result.current.alerts).toHaveLength(0);
      });

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          "cryptoAlerts",
          JSON.stringify([])
        );
      });
    });
  });

  describe("AlertProvider com useAlerts", () => {
    it("deve prover o contexto corretamente quando encapsulado por AlertProvider", async () => {
      // Arrange
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AlertProvider>{children}</AlertProvider>
      );

      // Act
      const { result } = await renderHook(() => useAlerts(), { wrapper });

      // Assert
      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });
      expect(result.current).toHaveProperty("alerts");
      expect(result.current).toHaveProperty("addAlert");
      expect(result.current).toHaveProperty("deleteAlert");
    });
  });
});
