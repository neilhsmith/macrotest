using AutoMapper;
using FluentValidation;
using MacroTest.Api.Data;
using Macrotest.Api.Features.Foods;
using Microsoft.EntityFrameworkCore;

namespace Macrotest.Api.Features.Brands;

public class Brand : BaseEntity {
  public required string Name { get; set; }
  public ICollection<Food> Foods { get; } = new List<Food>();
}

public class BrandSummaryDto {
  public int Id { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime? ModifiedAt { get; set; }

  public required string Name { get; set; }
  public required int FoodCount { get; set; }
}

public class UpsertBrandDto {
  public required string Name { get; set; }
}

public class UpsertBrandDtoValidator : AbstractValidator<UpsertBrandDto> {
  public UpsertBrandDtoValidator(AppDbContext dbContext) {
    RuleFor(b => b.Name)
      .NotEmpty()
      .MaximumLength(128);

    RuleFor(b => b.Name)
      .MustAsync(async (name, cancellationToken) => {
          var exists = await dbContext.Brands.AnyAsync(b => b.Name == name, cancellationToken);
          return !exists;
        }
      ).WithMessage("Name must be unique.");
  }
}

public class BrandProfile : Profile {
  public BrandProfile() {
    CreateMap<Brand, BrandSummaryDto>();
    CreateMap<UpsertBrandDto, Brand>();
  }
}
