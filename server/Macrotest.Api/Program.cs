using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using Hellang.Middleware.ProblemDetails;
using Macrotest.Api;
using MacroTest.Api.Data;
using Microsoft.EntityFrameworkCore;
using Pebble.Api.Configurations;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionStringOptions().MacrotestDbDev;
builder.Services.AddDbContext<AppDbContext>(options =>
  options.UseSqlServer(connectionString,
    builder => builder.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName)));

builder.Services.AddCors(options => {
  options.AddDefaultPolicy(policy => {
    policy
      .AllowAnyOrigin()
      .AllowAnyHeader().AllowAnyMethod()
      .WithExposedHeaders("X-Pagination");
  });
});

builder.Services
  .AddAutoMapper(Assembly.GetExecutingAssembly());

builder.Services
  .ConfigureProblemDetails();

builder.Services
  .AddControllers()
  .AddJsonOptions(options => {
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
  });

builder.Services.AddMediatR(config => config
  .RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
  app.UseSwagger();
  app.UseSwaggerUI(options => {
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
  });
}

app.UseProblemDetails();
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors();

app.MapControllers();

app.Run();
