import { render, renderHook } from "@testing-library/react-native";
import React from "react";
import { LoadingState } from "../LoadingState";
import { useLoadingState } from "../useLoadingState";

describe("LoadingState & useLoadingState", () => {
  describe("useLoadingState", () => {
    it("deve usar mensagem padrão quando não fornecida", async () => {
      // Arrange & Act
      const { result } = await renderHook(() => useLoadingState({}));

      // Assert
      expect(result.current.displayMessage).toBe("Loading...");
    });

    it("deve usar mensagem customizada quando fornecida", async () => {
      // Arrange & Act
      const { result } = await renderHook(() =>
        useLoadingState({ message: "Carregando moedas..." })
      );

      // Assert
      expect(result.current.displayMessage).toBe("Carregando moedas...");
    });
  });

  describe("LoadingState component", () => {
    it("deve renderizar a mensagem padrão", async () => {
      // Arrange & Act
      const { getByText } = await render(<LoadingState />);

      // Assert
      expect(getByText("Loading...")).toBeTruthy();
    });

    it("deve renderizar a mensagem customizada", async () => {
      // Arrange & Act
      const { getByText } = await render(
        <LoadingState message="Aguarde um momento" />
      );

      // Assert
      expect(getByText("Aguarde um momento")).toBeTruthy();
    });
  });
});
