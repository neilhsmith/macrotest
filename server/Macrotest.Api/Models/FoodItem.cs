namespace Macrotest.Api.Models;

public class FoodItem : BaseMacros
{
  public int Id { get; set; }
  public required string Name { get; set; }
  public int StandardServingSize { get; set; } // in milligrams
}