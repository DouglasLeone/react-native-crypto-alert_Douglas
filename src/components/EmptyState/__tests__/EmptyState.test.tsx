import { render, renderHook } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { EmptyState } from "../EmptyState";
import { useEmptyState } from "../useEmptyState";

describe("EmptyState & useEmptyState", () => {
  it("useEmptyState deve gerar um titleId único", async () => {
    // Arrange & Act
    const { result } = await renderHook(() => useEmptyState());

    // Assert
    expect(result.current.titleId).toBeDefined();
    expect(typeof result.current.titleId).toBe("string");
  });

  it("deve renderizar título e ícone corretamente", async () => {
    // Arrange
    const { getByText } = await render(
      <EmptyState icon={<Text>IconPlaceholder</Text>} title="Nenhum alerta" />
    );

    // Assert
    expect(getByText("Nenhum alerta")).toBeTruthy();
    expect(getByText("IconPlaceholder")).toBeTruthy();
  });

  it("deve renderizar descrição e componente de ação quando fornecidos", async () => {
    // Arrange
    const { getByText } = await render(
      <EmptyState
        icon={<Text>Icon</Text>}
        title="Vazio"
        description="Você ainda não cadastrou nada"
        action={<Text>Criar Novo</Text>}
      />
    );

    // Assert
    expect(getByText("Você ainda não cadastrou nada")).toBeTruthy();
    expect(getByText("Criar Novo")).toBeTruthy();
  });
});
