namespace Macrotest.Api.Features;

public abstract class BaseEntity {
  public int Id { get; set; }
  public DateTime CreatedAt { get; private set; }
  public DateTime? ModifiedAt { get; private set; }

  public void UpdateCreationProperties(DateTime createdOn) {
    CreatedAt = createdOn;
  }

  public void UpdateModifiedProperties(DateTime? lastModifiedOn) {
    ModifiedAt = lastModifiedOn;
  }
}
