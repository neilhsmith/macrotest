using AutoMapper;
using FluentValidation;
using MacroTest.Api.Data;
using Macrotest.Api.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Macrotest.Api.Features.Brands;

public static class UpdateBrand {
  public record Command(int Id, UpsertBrandDto UpsertBrandDto) : IRequest<BrandSummaryDto>;
  
  public class Handler : IRequestHandler<Command, BrandSummaryDto> {
    private readonly AppDbContext _dbContext;
    private readonly IMapper _mapper;

    public Handler(AppDbContext dbContext, IMapper mapper) {
      _dbContext = dbContext;
      _mapper = mapper;
    }
    
    public async Task<BrandSummaryDto> Handle(Command request, CancellationToken cancellationToken) {
      var validator = new UpsertBrandDtoValidator(_dbContext);
      await validator.ValidateAndThrowAsync(request.UpsertBrandDto, cancellationToken);

      var brand = await _dbContext.Brands
        .Include(b => b.Foods)
        .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

      if (brand is null) {
        throw new NotFoundException(nameof(Brand), request.Id);
      }

      brand.Name = request.UpsertBrandDto.Name;

      await _dbContext.SaveChangesAsync(cancellationToken);

      return _mapper.Map<Brand, BrandSummaryDto>(brand);
    }
  }
}
