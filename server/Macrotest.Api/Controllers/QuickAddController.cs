using MacroTest.Api.Data;
using Macrotest.Api.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Macrotest.Api.Controllers;

[Route("/api/quickadd")]
public class QuickAddController : ControllerBase {
  private readonly AppDbContext _dbContext;

  public QuickAddController(AppDbContext dbContext) {
    _dbContext = dbContext;
  }

  [HttpGet("GetQuickAddById")]
  [Route("{id}")]
  public async Task<ActionResult<QuickAdd>> GetQuickAddById(int id) {
    var quickAdd = await _dbContext.QuickAdds.FirstOrDefaultAsync(x => x.Id == id);
    
    return Ok(quickAdd);
  }
  
  [HttpPost(Name="CreateQuickAdd")]
  public async Task<ActionResult<QuickAdd>> CreateQuickAdd([FromBody] QuickAdd quickAdd) {
    await _dbContext.QuickAdds.AddAsync(quickAdd);
    await _dbContext.SaveChangesAsync();

    return Ok(quickAdd);
  }
}
