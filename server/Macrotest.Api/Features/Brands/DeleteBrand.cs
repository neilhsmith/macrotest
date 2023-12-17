using MacroTest.Api.Data;
using Macrotest.Api.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Macrotest.Api.Features.Brands;

public static class DeleteBrand {
  public record Command(int Id) : IRequest;
  
  public class Handler : IRequestHandler<Command> {
    private readonly AppDbContext _dbContext;

    public Handler(AppDbContext dbContext) {
      _dbContext = dbContext;
    }
    
    public async Task Handle(Command request, CancellationToken cancellationToken) {
      var brand = await _dbContext.Brands
        .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);
      
      if (brand is null) {
        throw new NotFoundException(nameof(Brand), request.Id);
      }

      _dbContext.Brands.Remove(brand);
      await _dbContext.SaveChangesAsync(cancellationToken);
    }
  }
}
