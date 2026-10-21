import * as AlertContextModule from "@context/AlertProvider/useAlertProvider";
import { act, renderHook } from "@testing-library/react-native";
import { router } from "expo-router";
import { useCreateAlertScreen } from "../useCreateAlertScreen";

describe("useCreateAlertScreen", () => {
  const mockAddAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AlertContextModule, "useAlerts").mockReturnValue({
      alerts: [],
      addAlert: mockAddAlert,
      deleteAlert: jest.fn(),
    });
  });

  it("deve inicializar com campos vazios e formulário inválido", async () => {
    // Arrange & Act
    const { result } = await renderHook(() => useCreateAlertScreen());

    // Assert
    expect(result.current.selectedCrypto).toBe("");
    expect(result.current.targetPrice).toBe("");
    expect(result.current.condition).toBe("above");
    expect(result.current.errors).toEqual({});
    expect(result.current.isFormValid).toBe(false);
    expect(result.current.cryptoOptions.length).toBeGreaterThan(0);
  });

  it("deve registrar erros de validação ao tentar salvar formulário em branco", async () => {
    // Arrange
    const { result } = await renderHook(() => useCreateAlertScreen());

    // Act
    await act(async () => {
      result.current.handleSave();
    });

    // Assert
    expect(result.current.errors.crypto).toBe("Please select a cryptocurrency");
    expect(result.current.errors.price).toBe("Please enter a target price");
    expect(mockAddAlert).not.toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("deve acusar erro caso o preço seja inválido ou menor ou igual a zero", async () => {
    // Arrange
    const { result } = await renderHook(() => useCreateAlertScreen());

    // Act - Preço com texto não numérico
    await act(async () => {
      result.current.setSelectedCrypto("bitcoin");
      result.current.setTargetPrice("not-a-number");
    });
    await act(async () => {
      result.current.handleSave();
    });

    // Assert
    expect(result.current.errors.price).toBe("Please enter a valid price");
    expect(result.current.isFormValid).toBe(false);

    // Act - Preço negativo ou zero
    await act(async () => {
      result.current.setTargetPrice("0");
    });
    await act(async () => {
      result.current.handleSave();
    });

    // Assert
    expect(result.current.errors.price).toBe("Please enter a valid price");
    expect(result.current.isFormValid).toBe(false);
  });

  it("deve salvar com sucesso quando campos forem válidos e redirecionar para /alerts", async () => {
    // Arrange
    const { result } = await renderHook(() => useCreateAlertScreen());

    // Act
    await act(async () => {
      result.current.setSelectedCrypto("bitcoin");
      result.current.setTargetPrice("75000");
      result.current.setCondition("below");
    });

    // Assert form status
    expect(result.current.isFormValid).toBe(true);

    // Act - Salvar
    await act(async () => {
      result.current.handleSave();
    });

    // Assert
    expect(mockAddAlert).toHaveBeenCalledWith({
      cryptocurrency: "Bitcoin",
      symbol: "BTC",
      targetPrice: 75000,
      condition: "below",
    });
    expect(router.replace).toHaveBeenCalledWith("/alerts");
  });

  it("deve chamar router.back ao acionar goBack", async () => {
    // Arrange
    const { result } = await renderHook(() => useCreateAlertScreen());

    // Act
    await act(async () => {
      result.current.goBack();
    });

    // Assert
    expect(router.back).toHaveBeenCalledTimes(1);
  });
});
