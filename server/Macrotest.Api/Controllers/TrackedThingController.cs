using MacroTest.Api.Data;
using Microsoft.AspNetCore.Mvc;

namespace Macrotest.Api.Controllers;

[ApiController]
[Route("/api/tracked-things")]
public class TrackedThingController : ControllerBase {
  private readonly AppDbContext _dbContext;

  public TrackedThingController(AppDbContext dbContext) {
    _dbContext = dbContext;
  }

  [HttpGet("GetTrackedThings")]
  [Route("{date?}")]
  public string GetTrackedThingsByDate(DateOnly? date) {
    if (date is null) {
      date = DateOnly.FromDateTime(DateTime.Now);
    }
    
    return "suh bro" + date;
  }
}
