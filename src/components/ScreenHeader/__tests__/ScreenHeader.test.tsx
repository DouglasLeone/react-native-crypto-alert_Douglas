import { fireEvent, render, renderHook } from "@testing-library/react-native";
import React from "react";
import { ScreenHeader } from "../ScreenHeader";
import { useScreenHeader } from "../useScreenHeader";

describe("ScreenHeader & useScreenHeader", () => {
  describe("useScreenHeader", () => {
    it("deve retornar showBack=false quando onBack não for passado", async () => {
      // Arrange & Act
      const { result } = await renderHook(() => useScreenHeader({}));

      // Assert
      expect(result.current.showBack).toBe(false);
    });

    it("deve retornar showBack=true e disparar onBack ao chamar handleBack", async () => {
      // Arrange
      const onBackMock = jest.fn();
      const { result } = await renderHook(() =>
        useScreenHeader({ onBack: onBackMock })
      );

      // Assert
      expect(result.current.showBack).toBe(true);

      // Act
      result.current.handleBack();

      // Assert
      expect(onBackMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("ScreenHeader component", () => {
    it("deve renderizar o título sem botão de voltar quando onBack for omitido", async () => {
      // Arrange & Act
      const { getByText, queryByLabelText } = await render(
        <ScreenHeader title="Criptomoedas" />
      );

      // Assert
      expect(getByText("Criptomoedas")).toBeTruthy();
      expect(queryByLabelText("Go back")).toBeNull();
    });

    it("deve renderizar botão de voltar e responder ao clique", async () => {
      // Arrange
      const onBackMock = jest.fn();
      const { getByText, getByLabelText } = await render(
        <ScreenHeader title="Criar Alerta" onBack={onBackMock} />
      );

      // Assert
      expect(getByText("Criar Alerta")).toBeTruthy();

      // Act
      const backButton = getByLabelText("Go back");
      fireEvent.press(backButton);

      // Assert
      expect(onBackMock).toHaveBeenCalledTimes(1);
    });
  });
});
