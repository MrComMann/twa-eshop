import { IsInt, IsNumber, IsString } from "class-validator";

export class ExampleCalcRequestDto {
  @IsInt()
  public x = 0;

  @IsInt()
  public y = 0;

  @IsString()
  public operation = "";
}

export class ExampleCalcResponseDto {
  @IsNumber()
  public result = 0;
}
