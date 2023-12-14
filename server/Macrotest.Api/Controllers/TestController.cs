using Microsoft.AspNetCore.Mvc;

namespace Macrotest.Api.Controllers;

[ApiController]
[Route("/api/test")]
public class TestController : ControllerBase
{
  [HttpGet]
  public string GetTest()
  {
    return "suh bruh";
  }
}