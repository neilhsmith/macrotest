using Microsoft.AspNetCore.Mvc;

namespace Macrotest.Api.Features;

public class BulkDeleteRequestDto {
  public ICollection<int> Ids { get; set; }
}

// public class BulkDeleteResponseDto {
//   public ICollection<BulkDeleteResult> Results { get; set; } = new List<BulkDeleteResult>();
// }
//
// public class BulkDeleteResult {
//   public required int Id { get; set; }
//   public required int Status { get; set; }
//   public required string Message { get; set; }
//   
//   public ValidationProblemDetails? Error { get; set; }
// }
