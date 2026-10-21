import { fireEvent, render, renderHook } from "@testing-library/react-native";
import React from "react";
import type { PriceAlert } from "@context/AlertProvider/useAlertProvider";
import { AlertCard } from "../AlertCard";
import { useAlertCard } from "../useAlertCard";

describe("AlertCard & useAlertCard", () => {
  const mockAlertAbove: PriceAlert = {
    id: "alert-1",
    cryptocurrency: "Bitcoin",
    symbol: "BTC",
    targetPrice: 65000,
    condition: "above",
    createdAt: "2026-01-01T00:00:00.000Z",
  };

  const mockAlertBelow: PriceAlert = {
    id: "alert-2",
    cryptocurrency: "Ethereum",
    symbol: "ETH",
    targetPrice: 3200,
    condition: "below",
    createdAt: "2026-01-01T00:00:00.000Z",
  };

  describe("useAlertCard", () => {
    it("deve retornar isAbove=true para condição above e chamar onDelete com id correto", async () => {
      // Arrange
      const onDeleteMock = jest.fn();
      const { result } = await renderHook(() =>
        useAlertCard({ alert: mockAlertAbove, onDelete: onDeleteMock })
      );

      // Assert
      expect(result.current.isAbove).toBe(true);

      // Act
      result.current.handleDelete();

      // Assert
      expect(onDeleteMock).toHaveBeenCalledWith("alert-1");
    });

    it("deve retornar isAbove=false para condição below", async () => {
      // Arrange
      const { result } = await renderHook(() =>
        useAlertCard({ alert: mockAlertBelow, onDelete: jest.fn() })
      );

      // Assert
      expect(result.current.isAbove).toBe(false);
    });
  });

  describe("AlertCard component", () => {
    it("deve renderizar informações do alerta com formatação e disparar deleção para condição above", async () => {
      // Arrange
      const onDeleteMock = jest.fn();
      const { getByText, getByLabelText } = await render(
        <AlertCard alert={mockAlertAbove} onDelete={onDeleteMock} />
      );

      // Assert
      expect(getByText("Bitcoin")).toBeTruthy();
      expect(getByText("above")).toBeTruthy();
      expect(getByText("$65,000.00")).toBeTruthy();

      // Act
      const deleteButton = getByLabelText("Delete alert");
      fireEvent.press(deleteButton);

      // Assert
      expect(onDeleteMock).toHaveBeenCalledWith("alert-1");
    });

    it("deve renderizar corretamente para condição below", async () => {
      // Arrange
      const { getByText } = await render(
        <AlertCard alert={mockAlertBelow} onDelete={jest.fn()} />
      );

      // Assert
      expect(getByText("Ethereum")).toBeTruthy();
      expect(getByText("below")).toBeTruthy();
      expect(getByText("$3,200.00")).toBeTruthy();
    });
  });
});
