import { formatChange, formatPrice } from "./index";

describe("Utils - formatPrice & formatChange", () => {
  describe("formatPrice", () => {
    it("deve formatar o preço com 2 casas decimais por padrão", () => {
      const result = formatPrice(1234.56);
      expect(result).toBe("1,234.56");
    });

    it("deve respeitar a quantidade customizada de casas decimais", () => {
      const result = formatPrice(1234.5678, 4);
      expect(result).toBe("1,234.5678");
    });

    it("deve formatar valor inteiro com casas decimais zeradas", () => {
      const result = formatPrice(500, 2);
      expect(result).toBe("500.00");
    });

    it("deve formatar zero corretamente", () => {
      const result = formatPrice(0);
      expect(result).toBe("0.00");
    });
  });

  describe("formatChange", () => {
    it("deve adicionar sinal de + para variações positivas", () => {
      const result = formatChange(2.45);
      expect(result).toBe("+2.45%");
    });

    it("deve adicionar sinal de + para variação zero", () => {
      const result = formatChange(0);
      expect(result).toBe("+0.00%");
    });

    it("deve manter sinal de - para variações negativas", () => {
      const result = formatChange(-1.23);
      expect(result).toBe("-1.23%");
    });

    it("deve arredondar para 2 casas decimais", () => {
      const result = formatChange(5.678);
      expect(result).toBe("+5.68%");
    });
  });
});
