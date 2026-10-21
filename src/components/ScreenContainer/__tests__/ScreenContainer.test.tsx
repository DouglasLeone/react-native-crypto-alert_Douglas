import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { ScreenContainer } from "../ScreenContainer";

describe("ScreenContainer", () => {
  it("deve renderizar os elementos filhos dentro do container seguro", async () => {
    // Arrange & Act
    const { getByText } = await render(
      <ScreenContainer>
        <Text>Conteúdo Interno</Text>
      </ScreenContainer>
    );

    // Assert
    expect(getByText("Conteúdo Interno")).toBeTruthy();
  });
});
