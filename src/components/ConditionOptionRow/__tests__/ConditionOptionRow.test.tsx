import { fireEvent, render, renderHook } from "@testing-library/react-native";
import React from "react";
import { ConditionOptionRow } from "../ConditionOptionRow";
import { useConditionOptionRow } from "../useConditionOptionRow";

describe("ConditionOptionRow & useConditionOptionRow", () => {
  describe("useConditionOptionRow", () => {
    it("deve disparar onSelect com o valor correspondente ao acionar handlePress", async () => {
      // Arrange
      const onSelectMock = jest.fn();
      const { result } = await renderHook(() =>
        useConditionOptionRow({ value: "above", onSelect: onSelectMock })
      );

      // Act
      result.current.handlePress();

      // Assert
      expect(onSelectMock).toHaveBeenCalledWith("above");
    });
  });

  describe("ConditionOptionRow component", () => {
    it("deve renderizar títulos e responder à seleção quando variant for below", async () => {
      // Arrange
      const onSelectMock = jest.fn();
      const { getByText, getByRole } = await render(
        <ConditionOptionRow
          value="below"
          variant="below"
          selected={false}
          title="Price falls below"
          subtitle="Alert when price drops"
          onSelect={onSelectMock}
        />
      );

      // Assert
      expect(getByText("Price falls below")).toBeTruthy();
      expect(getByText("Alert when price drops")).toBeTruthy();

      // Act
      const option = getByRole("radio");
      fireEvent.press(option);

      // Assert
      expect(onSelectMock).toHaveBeenCalledWith("below");
    });

    it("deve renderizar estilo de selecionado e variant above", async () => {
      // Arrange
      const onSelectMock = jest.fn();
      const { getByText, getByRole } = await render(
        <ConditionOptionRow
          value="above"
          variant="above"
          selected={true}
          title="Price rises above"
          subtitle="Alert when price climbs"
          onSelect={onSelectMock}
        />
      );

      // Assert
      expect(getByText("Price rises above")).toBeTruthy();
      const option = getByRole("radio");
      expect(option.props.accessibilityState.selected).toBe(true);
    });
  });
});
