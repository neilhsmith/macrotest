using AutoMapper;
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
    private readonly IMapper _mapper;

    public Handler(AppDbContext dbContext, IMapper mapper) {
      _dbContext = dbContext;
      _mapper = mapper;
    }

    public async Task<PagedList<BrandSummaryDto>> Handle(Query request, CancellationToken cancellationToken) {
      var queryKitConfiguration = new AppQueryKitConfiguration();
      var queryKitData = new QueryKitData {
        Configuration = queryKitConfiguration
      };

      var collection = _dbContext.Brands.Include(b => b.Foods).AsNoTracking();
      var appliedCollection = collection.ApplyQueryKit(queryKitData);

      var brandDtos = appliedCollection.Select(brand => _mapper.Map<Brand, BrandSummaryDto>(brand));
      
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
