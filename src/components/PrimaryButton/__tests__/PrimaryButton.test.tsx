import { fireEvent, render, renderHook } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { PrimaryButton } from "../PrimaryButton";
import { usePrimaryButton } from "../usePrimaryButton";

describe("PrimaryButton & usePrimaryButton", () => {
  describe("usePrimaryButton", () => {
    it("deve chamar onPress quando não estiver desabilitado", async () => {
      // Arrange
      const onPressMock = jest.fn();
      const { result } = await renderHook(() =>
        usePrimaryButton({ onPress: onPressMock, disabled: false })
      );

      // Act
      result.current.handlePress();

      // Assert
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it("não deve chamar onPress quando desabilitado", async () => {
      // Arrange
      const onPressMock = jest.fn();
      const { result } = await renderHook(() =>
        usePrimaryButton({ onPress: onPressMock, disabled: true })
      );

      // Act
      result.current.handlePress();

      // Assert
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe("PrimaryButton component", () => {
    it("deve renderizar o label e responder ao clique", async () => {
      // Arrange
      const onPressMock = jest.fn();
      const { getByText } = await render(
        <PrimaryButton label="Confirmar" onPress={onPressMock} />
      );

      // Act
      const buttonText = getByText("Confirmar");
      fireEvent.press(buttonText);

      // Assert
      expect(buttonText).toBeTruthy();
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it("não deve disparar onPress quando estiver disabled", async () => {
      // Arrange
      const onPressMock = jest.fn();
      const { getByRole } = await render(
        <PrimaryButton label="Desabilitado" onPress={onPressMock} disabled />
      );

      // Act
      const button = getByRole("button");
      fireEvent.press(button);

      // Assert
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it("deve renderizar com leftIcon e tamanho sm", async () => {
      // Arrange
      const { getByText } = await render(
        <PrimaryButton
          label="Com Ícone"
          onPress={jest.fn()}
          size="sm"
          fullWidth
          leftIcon={<Text>IconeMock</Text>}
        />
      );

      // Assert
      expect(getByText("IconeMock")).toBeTruthy();
      expect(getByText("Com Ícone")).toBeTruthy();
    });
  });
});
