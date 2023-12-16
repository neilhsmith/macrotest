using System.Text.Json;
using MacroTest.Api.Data;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Macrotest.Api.Features.Brands;

[ApiController]
[Route("/api/brands")]
public class BrandsController : ControllerBase {
  private readonly ILogger<BrandsController> _logger;
  private readonly IMediator _mediator;

  public BrandsController(ILogger<BrandsController> logger, IMediator mediator) {
    _logger = logger;
    _mediator = mediator;
  }

  [HttpGet("{id:int}", Name = "GetBrandSummary")]
  public async Task<ActionResult<BrandSummaryDto>> GetBrandSummary(int id) {
    var query = new GetBrandSummary.Query(id);
    var response = await _mediator.Send(query);
    
    return Ok(response);
  }

  [HttpGet(Name = "GetBrandSummaryList")]
  public async Task<ActionResult<PagedList<BrandSummaryDto>>> GetBrands([FromQuery] BrandPaginationParametersDto dto) {
    var query = new GetBrandSummaryList.Query(dto);
    var response = await _mediator.Send(query);
    
    var paginationMetadata = new
    {
      totalCount = response.TotalCount,
      pageSize = response.PageSize,
      currentPageSize = response.CurrentPageSize,
      currentStartIndex = response.CurrentStartIndex,
      currentEndIndex = response.CurrentEndIndex,
      pageNumber = response.PageNumber,
      totalPages = response.TotalPages,
      hasPrevious = response.HasPrevious,
      hasNext = response.HasNext
    };

    Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetadata));
    return Ok(response);
  }

  [HttpPost(Name = "CreateBrand")]
  public async Task<ActionResult<BrandSummaryDto>> CreateBrand([FromBody] CreateBrandDto dto) {
    var command = new CreateBrand.Command(dto);
    var response = await _mediator.Send(command);

    return CreatedAtRoute("GetBrandSummary", new { response.Id }, response);
  } 
}
