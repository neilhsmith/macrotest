using FluentValidation;
using MacroTest.Api.Data;
using MediatR;

namespace Macrotest.Api.Features.Brands;

public static class CreateBrand {
  public sealed record Command(CreateBrandDto CreateBrandDto) : IRequest<BrandSummaryDto>;
  
  public class Handler : IRequestHandler<Command, BrandSummaryDto> {
    private readonly AppDbContext _dbContext;

    public Handler(AppDbContext dbContext) {
      _dbContext = dbContext;
    }
    
    public async Task<BrandSummaryDto> Handle(Command request, CancellationToken cancellationToken) {
      var validator = new CreateBrandDtoValidator();
      await validator.ValidateAndThrowAsync(request.CreateBrandDto, cancellationToken);
      
      var brand = new Brand {
        Name = request.CreateBrandDto.Name
      };

      await _dbContext.AddAsync(brand);
      await _dbContext.SaveChangesAsync();

      return new BrandSummaryDto {
        Id = brand.Id,
        CreatedAt = brand.CreatedAt,
        Name = brand.Name,
        FoodCount = 0
      };
    }
  }
}

public class CreateBrandDto {
  public required string Name { get; set; }
}

public class CreateBrandDtoValidator : AbstractValidator<CreateBrandDto> {
  public CreateBrandDtoValidator() {
    RuleFor(b => b.Name)
      .NotEmpty()
      .MaximumLength(128);
  }
}
