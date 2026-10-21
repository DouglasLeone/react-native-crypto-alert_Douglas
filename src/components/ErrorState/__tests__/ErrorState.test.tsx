import { fireEvent, render, renderHook } from "@testing-library/react-native";
import React from "react";
import { ErrorState } from "../ErrorState";
import { useErrorState } from "../useErrorState";

describe("ErrorState & useErrorState", () => {
  describe("useErrorState", () => {
    it("deve indicar showRetry=true e executar onRetry ao chamar handleRetry", async () => {
      // Arrange
      const onRetryMock = jest.fn();
      const { result } = await renderHook(() =>
        useErrorState({ onRetry: onRetryMock })
      );

      // Assert
      expect(result.current.showRetry).toBe(true);

      // Act
      result.current.handleRetry();

      // Assert
      expect(onRetryMock).toHaveBeenCalledTimes(1);
    });

    it("deve indicar showRetry=false quando onRetry não for fornecido", async () => {
      // Arrange & Act
      const { result } = await renderHook(() => useErrorState({}));

      // Assert
      expect(result.current.showRetry).toBe(false);

      // Act
      expect(() => result.current.handleRetry()).not.toThrow();
    });
  });

  describe("ErrorState component", () => {
    it("deve renderizar com textos padrão e sem botão de retry quando onRetry não for passado", async () => {
      // Arrange & Act
      const { getByText, queryByText } = await render(<ErrorState />);

      // Assert
      expect(getByText("Something went wrong")).toBeTruthy();
      expect(
        getByText("We couldn't load the data. Please try again.")
      ).toBeTruthy();
      expect(queryByText("Retry")).toBeNull();
    });

    it("deve renderizar mensagens personalizadas e disparar onRetry ao pressionar botão", async () => {
      // Arrange
      const onRetryMock = jest.fn();
      const { getByText, getByRole } = await render(
        <ErrorState
          title="Falha de conexão"
          message="Verifique sua internet"
          onRetry={onRetryMock}
        />
      );

      // Assert
      expect(getByText("Falha de conexão")).toBeTruthy();
      expect(getByText("Verifique sua internet")).toBeTruthy();

      // Act
      const retryButton = getByRole("button");
      fireEvent.press(retryButton);

      // Assert
      expect(onRetryMock).toHaveBeenCalledTimes(1);
    });
  });
});
