using AutoMapper;
using MacroTest.Api.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Macrotest.Api.Features.Brands;

public static class DeleteBrands {
  public record Command(BulkDeleteRequestDto BulkDeleteRequestDto) : IRequest<int>;

  public class Handler : IRequestHandler<Command, int> {
    private readonly AppDbContext _dbContext;
    private readonly IMapper _mapper;

    public Handler(AppDbContext dbContext, IMapper mapper) {
      _dbContext = dbContext;
      _mapper = mapper;
    }

    public async Task<int> Handle(Command request, CancellationToken cancellationToken) {
      return await _dbContext.Brands
        .Where(b => request.BulkDeleteRequestDto.Ids.Contains(b.Id))
        .ExecuteDeleteAsync();
    }
  }
}
