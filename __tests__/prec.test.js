/**
 * Jest tests for the Jison parser
 * Paso 3: Pruebas de estrés y situaciones complejas
 */

const parse = require("../src/parser.js").parse;

describe('Parser Failing Tests', () => {
  
  describe('Precedence: multiplication and division before addition and subtraction', () => {
    test('should handle basic multiplication before addition', () => {
      expect(parse("2 + 3 * 4")).toBe(14); // 2 + (3 * 4) = 14
      expect(parse("5 * 2 + 3")).toBe(13); // (5 * 2) + 3 = 13
    });

    test('should handle basic division before subtraction', () => {
      expect(parse("10 - 6 / 2")).toBe(7); // 10 - (6 / 2) = 7
      expect(parse("20 / 4 - 2")).toBe(3); // (20 / 4) - 2 = 3
    });

    test('should handle complex chained operations with mixed precedence', () => {
      expect(parse("1 + 2 * 3 / 6 - 1")).toBe(1); // 1 + ((2 * 3) / 6) - 1 = 1 + 1 - 1 = 1
      expect(parse("100 / 2 / 2 - 10 * 2")).toBe(5); // ((100 / 2) / 2) - (10 * 2) = 25 - 20 = 5
    });

    test('should handle complex expressions with multiple operators', () => {
      expect(parse("5 * 4 - 3 * 2 + 10 / 5")).toBe(16); // (5 * 4) - (3 * 2) + (10 / 5) = 20 - 6 + 2 = 16
      expect(parse("0.5 * 10 + 2.5 / 0.5")).toBe(10); // (0.5 * 10) + (2.5 / 0.5) = 5 + 5 = 10
    });
  });

  describe('Precedence: exponentiation with highest precedence', () => {
    test('should handle basic exponentiation before addition', () => {
      expect(parse("2 + 3 ** 2")).toBe(11); // 2 + (3 ** 2) = 11
    });

    test('should handle basic exponentiation before multiplication', () => {
      expect(parse("2 * 3 ** 2")).toBe(18); // 2 * (3 ** 2) = 18
    });

    test('should handle basic exponentiation before subtraction', () => {
      expect(parse("10 - 2 ** 3")).toBe(2); // 10 - (2 ** 3) = 2
    });

    test('should handle exponentiation in complex multiplication chains', () => {
      expect(parse("2 * 3 ** 2 * 2")).toBe(36); // 2 * (3 ** 2) * 2 = 2 * 9 * 2 = 36
      expect(parse("2 ** 3 * 2 ** 2")).toBe(32); // (2 ** 3) * (2 ** 2) = 8 * 4 = 32
    });

    test('should handle nested exponentiation in complex expressions', () => {
      expect(parse("100 - 2 ** 2 ** 2")).toBe(84); // 100 - (2 ** (2 ** 2)) = 100 - 16 = 84
      expect(parse("1 + 2 ** 3 ** 2 / 128")).toBe(5); // 1 + ((2 ** (3 ** 2)) / 128) = 1 + (512 / 128) = 5
    });
  });

  describe('Associativity: right associativity for exponentiation', () => {
    test('should handle basic right associativity', () => {
      expect(parse("2 ** 3 ** 2")).toBe(512); // 2 ** (3 ** 2) = 2 ** 9 = 512
      expect(parse("3 ** 2 ** 2")).toBe(81); // 3 ** (2 ** 2) = 3 ** 4 = 81
    });

    test('should handle long chains of exponentiation', () => {
      expect(parse("2 ** 2 ** 2 ** 2")).toBe(65536); // 2 ** (2 ** (2 ** 2)) = 2 ** (2 ** 4) = 2 ** 16
      expect(parse("4 ** 3 ** 2")).toBe(262144); // 4 ** (3 ** 2) = 4 ** 9
    });

    test('should handle edge cases with exponent of 1', () => {
      expect(parse("2 ** 1 ** 5 ** 10")).toBe(2); // 2 ** (1 ** (5 ** 10)) = 2 ** 1 = 2
    });
  });

  describe('Mixed operations with all precedence levels', () => {
    test('should handle basic mixed operations', () => {
      expect(parse("1 + 2 * 3 - 4")).toBe(3); // 1 + (2 * 3) - 4 = 3
      expect(parse("15 / 3 + 2 * 4")).toBe(13); // (15 / 3) + (2 * 4) = 13
      expect(parse("10 - 3 * 2 + 1")).toBe(5); // 10 - (3 * 2) + 1 = 5
    });

    test('should handle exponentiation with multiplication in complex expressions', () => {
      expect(parse("2 + 3 * 4 ** 2")).toBe(50); // 2 + (3 * (4 ** 2)) = 2 + 48 = 50
      expect(parse("10 / 2 * 5 ** 2 - 100")).toBe(25); // ((10 / 2) * (5 ** 2)) - 100 = (5 * 25) - 100 = 25
    });

    test('should handle complex nested operations with all operators', () => {
      expect(parse("10 * 2 ** 3 / 4 + 5")).toBe(25); // ((10 * (2 ** 3)) / 4) + 5 = 20 + 5 = 25
      expect(parse("2 ** 3 ** 2 - 500 + 12")).toBe(24); // (2 ** (3 ** 2)) - 500 + 12 = 512 - 500 + 12 = 24
    });
  });

  describe('Exponentiation precedence in various contexts', () => {
    test('should handle exponentiation at end of expression', () => {
      expect(parse("2 ** 3 + 1")).toBe(9); // (2 ** 3) + 1 = 9
      expect(parse("3 + 2 ** 4")).toBe(19); // 3 + (2 ** 4) = 19
    });

    test('should handle exponentiation with multiplication', () => {
      expect(parse("2 * 3 ** 2 + 1")).toBe(19); // (2 * (3 ** 2)) + 1 = 19
    });

    test('should handle deeply nested exponentiation expressions', () => {
      expect(parse("5 + 2 * 3 ** 2 ** 2 / 81")).toBe(7); // 5 + ((2 * (3 ** (2 ** 2))) / 81) = 5 + (2 * 81 / 81) = 7
      expect(parse("2 ** 2 ** 3 - 200 - 50")).toBe(6); // (2 ** (2 ** 3)) - 200 - 50 = 256 - 200 - 50 = 6
    });
  });

  describe('Realistic calculations', () => {
    test('should handle simple realistic calculations', () => {
      expect(parse("1 + 2 * 3")).toBe(7); // 1 + (2 * 3) = 7
      expect(parse("6 / 2 + 4")).toBe(7); // (6 / 2) + 4 = 7
      expect(parse("2 ** 2 + 1")).toBe(5); // (2 ** 2) + 1 = 5
    });

    test('should handle calculations with left associativity', () => {
      expect(parse("10 / 2 / 5")).toBe(1); // ((10 / 2) / 5) = 1
      expect(parse("100 - 50 + 25")).toBe(75); // (100 - 50) + 25 = 75
    });

    test('should handle multiple separate operations', () => {
      expect(parse("2 * 3 + 4 * 5")).toBe(26); // (2 * 3) + (4 * 5) = 26
    });

    test('should handle calculations with decimal numbers', () => {
      expect(parse("1.5 * 2 + 4.5 / 1.5")).toBe(6); // 3 + 3 = 6
    });

    test('should handle complex division chains', () => {
      expect(parse("2 ** 3 ** 2 / 2 / 2 / 2")).toBe(64); // ((512 / 2) / 2) / 2 = 64
      expect(parse("100 / 10 * 10 / 10 * 10")).toBe(100); // ((((100/10)*10)/10)*10) = 100
    });

    test('should handle edge cases with identity exponents', () => {
      expect(parse("1 + 1 + 1 + 1 ** 2 ** 3")).toBe(4); // 1 + 1 + 1 + (1 ** 8) = 4
    });
  });
});