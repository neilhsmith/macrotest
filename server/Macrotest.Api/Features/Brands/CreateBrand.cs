using AutoMapper;
using FluentValidation;
using MacroTest.Api.Data;
using MediatR;

namespace Macrotest.Api.Features.Brands;

public static class CreateBrand {
  public sealed record Command(UpsertBrandDto Model) : IRequest<BrandSummaryDto>;
  
  public class Handler : IRequestHandler<Command, BrandSummaryDto> {
    private readonly AppDbContext _dbContext;
    private readonly IMapper _mapper;

    public Handler(AppDbContext dbContext, IMapper mapper) {
      _dbContext = dbContext;
      _mapper = mapper;
    }
    
    public async Task<BrandSummaryDto> Handle(Command request, CancellationToken cancellationToken) {
      var validator = new UpsertBrandDtoValidator(_dbContext);
      await validator.ValidateAndThrowAsync(request.Model, cancellationToken);
      
      var brand = _mapper.Map<UpsertBrandDto, Brand>(request.Model);

      await _dbContext.AddAsync(brand, cancellationToken);
      await _dbContext.SaveChangesAsync(cancellationToken);

      return _mapper.Map<Brand, BrandSummaryDto>(brand);
    }
  }
}


