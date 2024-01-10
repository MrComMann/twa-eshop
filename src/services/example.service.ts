class ExampleService {
  // Funkce, kterou voláme pro vypočítání výsledku. Nepracujeme s HTTP věcmi, pouze se vstupy. Tuto funkci
  // otestujeme v jestu
  calc(x: number, y: number, operation: string): number | false {
    let result = 0;
    switch (operation) {
      case "+":
        result = x + y;
        break;
      case "-":
        result = x - y;
        break;
      case "*":
        result = x * y;
        break;
      case "/":
        if (y == 0) {
          return false;
        }
        result = x / y;
        break;
    }
    return result;
  }
}

export const exampleService = new ExampleService();
