namespace Macrotest.Api.Models;

public class TrackedThing
{
  public int Id { get; set; }
  public DateOnly CreatedOn { get; set; }
  public int ServingSize { get; set; }

  public int? FoodItemId { get; set; }
  public FoodItem? FoodItem { get; set; }

  public int? QuickAddId { get; set; }
  public QuickAdd? QuickAdd { get; set; }
}
