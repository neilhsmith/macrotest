using MacroTest.Api.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using QueryKit;
using QueryKit.Configuration;

namespace Macrotest.Api.Features.Brands;

public static class GetBrandSummaryList {
  public sealed record Query(BrandPaginationParametersDto BrandPaginationParametersDto)
    : IRequest<PagedList<BrandSummaryDto>>;

  public sealed class Handler : IRequestHandler<Query, PagedList<BrandSummaryDto>> {
    private readonly AppDbContext _dbContext;

    public Handler(AppDbContext dbContext) {
      _dbContext = dbContext;
    }

    public async Task<PagedList<BrandSummaryDto>> Handle(Query request, CancellationToken cancellationToken) {
      var queryKitConfiguration = new AppQueryKitConfiguration();
      var queryKitData = new QueryKitData {
        Configuration = queryKitConfiguration
      };

      var collection = _dbContext.Brands.Include(b => b.Foods).AsNoTracking();
      var appliedCollection = collection.ApplyQueryKit(queryKitData);

      var brandDtos = appliedCollection.Select(brand => new BrandSummaryDto {
        Id = brand.Id,
        CreatedAt = brand.CreatedAt,
        Name = brand.Name,
        FoodCount = brand.Foods.Count
      });

      return await PagedList<BrandSummaryDto>.CreateAsync(
        brandDtos,
        request.BrandPaginationParametersDto.PageNumber,
        request.BrandPaginationParametersDto.PageSize,
        cancellationToken
      );
    }
  }
}

public sealed class BrandPaginationParametersDto : BasePaginationParameters { }
