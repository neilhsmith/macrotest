using Microsoft.Extensions.Configuration;

namespace Pebble.Api.Configurations;

public class ConnectionStringOptions
{
  public const string SectionName = "ConnectionStrings";
  public const string PinIslandApiDevDbKey = nameof(MacrotestDbDev);

  public string MacrotestDbDev { get; set; } = string.Empty;
}

public static class ConnectionStringOptionsExtensions
{
  public static ConnectionStringOptions GetConnectionStringOptions(this IConfiguration configuration)
    => configuration.GetSection(ConnectionStringOptions.SectionName).Get<ConnectionStringOptions>()
       ?? new ConnectionStringOptions();
}
