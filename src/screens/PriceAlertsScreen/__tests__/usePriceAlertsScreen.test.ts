import * as AlertContextModule from "@context/AlertProvider/useAlertProvider";
import { act, renderHook } from "@testing-library/react-native";
import { router } from "expo-router";
import { usePriceAlertsScreen } from "../usePriceAlertsScreen";

describe("usePriceAlertsScreen", () => {
  const mockDeleteAlert = jest.fn();
  const mockAlerts: AlertContextModule.PriceAlert[] = [
    {
      id: "alert-1",
      cryptocurrency: "Bitcoin",
      symbol: "BTC",
      targetPrice: 65000,
      condition: "above",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AlertContextModule, "useAlerts").mockReturnValue({
      alerts: mockAlerts,
      addAlert: jest.fn(),
      deleteAlert: mockDeleteAlert,
    });
  });

  it("deve retornar alertas e permitir acionar deleteAlert", async () => {
    // Arrange & Act
    const { result } = await renderHook(() => usePriceAlertsScreen());

    // Assert
    expect(result.current.alerts).toEqual(mockAlerts);

    // Act - delete
    await act(async () => {
      result.current.deleteAlert("alert-1");
    });

    // Assert
    expect(mockDeleteAlert).toHaveBeenCalledWith("alert-1");
  });

  it("deve navegar para a tela de criação ao chamar goToCreate", async () => {
    // Arrange
    const { result } = await renderHook(() => usePriceAlertsScreen());

    // Act
    await act(async () => {
      result.current.goToCreate();
    });

    // Assert
    expect(router.push).toHaveBeenCalledWith("/alerts/create");
  });
});
