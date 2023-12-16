using QueryKit.Configuration;

namespace Macrotest.Api;

public class AppQueryKitConfiguration : QueryKitConfiguration
{
  public AppQueryKitConfiguration(Action<QueryKitSettings>? configureSettings = null)
    : base(settings =>
    {
      configureSettings?.Invoke(settings);
    })
  { }
}
