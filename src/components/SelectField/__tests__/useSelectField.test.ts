import { act, renderHook } from "@testing-library/react-native";
import { useSelectField, type SelectOption } from "../useSelectField";

describe("useSelectField", () => {
  const options: SelectOption[] = [
    { value: "btc", title: "Bitcoin", subtitle: "BTC" },
    { value: "eth", title: "Ethereum" },
  ];

  it("deve inicializar com modal fechado e formatar displayLabel com subtítulo", async () => {
    // Arrange & Act
    const { result } = await renderHook(() =>
      useSelectField({
        options,
        value: "btc",
        onChange: jest.fn(),
      })
    );

    // Assert
    expect(result.current.modalVisible).toBe(false);
    expect(result.current.displayLabel).toBe("Bitcoin (BTC)");
    expect(result.current.selected?.value).toBe("btc");
  });

  it("deve formatar displayLabel apenas com title quando subtitle não for fornecido", async () => {
    // Arrange & Act
    const { result } = await renderHook(() =>
      useSelectField({
        options,
        value: "eth",
        onChange: jest.fn(),
      })
    );

    // Assert
    expect(result.current.displayLabel).toBe("Ethereum");
  });

  it("deve retornar displayLabel vazio quando valor não for encontrado nas opções", async () => {
    // Arrange & Act
    const { result } = await renderHook(() =>
      useSelectField({
        options,
        value: "not-found",
        onChange: jest.fn(),
      })
    );

    // Assert
    expect(result.current.displayLabel).toBe("");
    expect(result.current.selected).toBeUndefined();
  });

  it("deve abrir e fechar o modal", async () => {
    // Arrange
    const { result } = await renderHook(() =>
      useSelectField({
        options,
        value: "btc",
        onChange: jest.fn(),
      })
    );

    // Act - Open
    await act(async () => {
      result.current.open();
    });
    expect(result.current.modalVisible).toBe(true);

    // Act - Close
    await act(async () => {
      result.current.close();
    });
    expect(result.current.modalVisible).toBe(false);
  });

  it("deve disparar onChange e fechar o modal ao selecionar item", async () => {
    // Arrange
    const onChangeMock = jest.fn();
    const { result } = await renderHook(() =>
      useSelectField({
        options,
        value: "btc",
        onChange: onChangeMock,
      })
    );

    // Act - Open modal
    await act(async () => {
      result.current.open();
    });
    expect(result.current.modalVisible).toBe(true);

    // Act - Select item
    await act(async () => {
      result.current.selectItem("eth");
    });

    // Assert
    expect(onChangeMock).toHaveBeenCalledWith("eth");
    expect(result.current.modalVisible).toBe(false);
  });
});
