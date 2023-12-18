using System.Text.Json;
using MacroTest.Api.Data;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

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

  [ProducesResponseType(200)]
  [ProducesResponseType(404)]
  [HttpGet("{id:int}", Name = "GetBrandSummary")]
  public async Task<ActionResult<BrandSummaryDto>> GetBrandSummary(int id, CancellationToken cancellationToken) {
    var query = new GetBrandSummary.Query(id);
    var response = await _mediator.Send(query, cancellationToken);

    return Ok(response);
  }

  [ProducesResponseType(200)]
  [HttpGet(Name = "GetBrandSummaryList")]
  public async Task<ActionResult<PagedList<BrandSummaryDto>>> GetBrands(
    [FromQuery] BrandPaginationParametersDto dto,
    CancellationToken cancellationToken
  ) {
    var query = new GetBrandSummaryList.Query(dto);
    var response = await _mediator.Send(query, cancellationToken);

    var paginationMetadata = new {
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

  [ProducesResponseType(201)]
  [ProducesResponseType(422)]
  [HttpPost(Name = "CreateBrand")]
  public async Task<ActionResult<BrandSummaryDto>> CreateBrand([FromBody] UpsertBrandDto dto) {
    var command = new CreateBrand.Command(dto);
    var response = await _mediator.Send(command);

    return CreatedAtRoute("GetBrandSummary", new { response.Id }, response);
  }

  [ProducesResponseType(200)]
  [ProducesResponseType(404)]
  [ProducesResponseType(422)]
  [HttpPut("{id:int}", Name = "UpdateBrand")]
  public async Task<ActionResult<BrandSummaryDto>> UpdateBrand(int id, [FromBody] UpsertBrandDto dto) {
    var command = new UpdateBrand.Command(id, dto);
    var response = await _mediator.Send(command);

    return Ok(response);
  }

  [ProducesResponseType(204)]
  [ProducesResponseType(404)]
  [HttpDelete("{id:int}", Name = "DeleteBrand")]
  public async Task<ActionResult> DeleteBrand(int id) {
    var command = new DeleteBrand.Command(id);
    await _mediator.Send(command);

    return NoContent();
  }

  [ProducesResponseType(204)]
  [HttpPost("delete", Name = "DeleteBrands")]
  public async Task<ActionResult> DeleteBrands([FromBody] BulkDeleteRequestDto requestDto) {
    // TODO: create a better bulk-delete reusable command which returns a valid multi-status
    
    var command = new DeleteBrands.Command(requestDto);
    var response = await _mediator.Send(command);
    
    return NoContent();
  }
}
