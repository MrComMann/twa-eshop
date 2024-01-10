import { ExampleCalcRequestDto, ExampleCalcResponseDto } from "../models";
import { exampleService } from "../services";
import { HttpError } from "../middleware";

class ExampleController {
  // V controlleru se staráme o tvorbu odpovědi (ExampleCalcResponseDto), kteoru následně vrátíme. Zároveň uděláme
  // dodatečné kontroly, např. zde že pokud dělíme, tak jmenovatel nesmí být nula. Na základě výsledku validace
  // můžeme v controlleru házet HTTP status kódy. Samotný výsledek však získáme z service
  calc(data: ExampleCalcRequestDto): ExampleCalcResponseDto {
    const response = new ExampleCalcResponseDto();
    const { x, y, operation } = data;
    let result;
    if (["+", "-", "-", "/"].includes(operation)) {
      if (operation == "/" && y == 0) {
        // Chyba, vyhodíme HTTP error
        throw new HttpError("Division by zero");
      }
      // Získáme výsledek
      result = exampleService.calc(x, y, operation);
      if (result != false) {
        response.result = result;
      } else {
        throw new HttpError("Invalid request");
      }
    } else {
      throw new HttpError("Invalid request");
    }
    return response;
  }
}

export const exampleController = new ExampleController();
