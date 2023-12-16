using FluentValidation;
using Hellang.Middleware.ProblemDetails;
using Hellang.Middleware.ProblemDetails.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http;
using Macrotest.Api.Exceptions;
using Microsoft.AspNetCore.Mvc.ModelBinding;

using AspNetCoreStatusCodes = Microsoft.AspNetCore.Http.StatusCodes;
using ProblemDetailsOptions = Hellang.Middleware.ProblemDetails.ProblemDetailsOptions;

namespace Macrotest.Api;

public static class ProblemDetailsConfiguration {
  public static void ConfigureProblemDetails(this IServiceCollection services) {
    ProblemDetailsExtensions
      .AddProblemDetails(services, ConfigureOptions)
      .AddProblemDetailsConventions();
  }

  public static void ConfigureOptions(ProblemDetailsOptions options) {
    var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

    options.IncludeExceptionDetails = (ctx, env) => environment == "Development" || environment == "Staging";

    options.MapFluentValidationExceptionWithDetail();

    options.MapToStatusCodeWithDetail<NotFoundException>(AspNetCoreStatusCodes.Status404NotFound);
    options.MapToStatusCodeWithDetail<NotSupportedException>(AspNetCoreStatusCodes.Status405MethodNotAllowed);
    options.MapToStatusCodeWithDetail<NotImplementedException>(AspNetCoreStatusCodes.Status501NotImplemented);
    options.MapToStatusCodeWithDetail<HttpRequestException>(AspNetCoreStatusCodes.Status503ServiceUnavailable);

    options.MapToStatusCodeWithDetail<Exception>(AspNetCoreStatusCodes.Status500InternalServerError);
  }

  public static void MapToStatusCodeWithDetail<TException>(this ProblemDetailsOptions options, int statusCode)
    where TException : Exception {

    options.Map<TException>((ctx, ex) => {
      var factory = ctx.RequestServices.GetRequiredService<ProblemDetailsFactory>();

      return factory.CreateProblemDetails(ctx, statusCode, detail: ex.Message);
    });
  }

  public static void MapFluentValidationExceptionWithDetail(this ProblemDetailsOptions options) {
    options.Map<ValidationException>((ctx, ex) => {
      var factory = ctx.RequestServices.GetRequiredService<ProblemDetailsFactory>();

      var modelStateDictionary = new ModelStateDictionary();
      foreach (var err in ex.Errors.DistinctBy(e => e.ErrorMessage)) {
        modelStateDictionary.AddModelError(err.PropertyName, err.ErrorMessage);
      }

      return factory.CreateValidationProblemDetails(ctx, modelStateDictionary, detail: ex.Message);
    });
  }
}
