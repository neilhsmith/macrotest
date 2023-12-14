namespace Macrotest.Api.Models;

public abstract class BaseMacros
{
  public int Calories { get; set; }
  public int Protein { get; set; }
  public int Carbs { get; set; }
  public int Fat { get; set; }

  public int? SaturatedFat { get; set; }
  public int? UnsaturatedFat { get; set; }
  public int? Fiber { get; set; }
  public int? Sugars { get; set; }
  public int? Sodium { get; set; }
  public int? Cholesterol { get; set; }
  public int? Potassium { get; set; }
}