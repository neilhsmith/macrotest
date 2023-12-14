using System.Text.Json.Serialization;
using MacroTest.Api.Data;
using Microsoft.EntityFrameworkCore;
using Pebble.Api.Configurations;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionStringOptions().MacrotestDbDev;
builder.Services.AddDbContext<AppDbContext>(options =>
  options.UseSqlServer(connectionString,
    builder => builder.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName)));

builder.Services
  .AddControllers()
  .AddJsonOptions(options =>
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

var app = builder.Build();

app.UseHttpsRedirection();
app.UseRouting();

app.MapControllers();

app.Run();
