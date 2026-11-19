namespace Rite.Api.Data;

// ps-017: where a memory's photo bytes live on disk (constitution Principle X —
// VM filesystem, SQLite-managed metadata — rather than a database blob or an
// object-storage service, since no dedicated object-storage need exists yet).
public sealed class MediaStorage(string root)
{
    public string Root { get; } = root;

    public string MemoryDirectory(Guid accountId, Guid memoryId) =>
        Path.Combine(Root, "memories", accountId.ToString(), memoryId.ToString());

    public string PhotoPath(Guid accountId, Guid memoryId, Guid photoId) =>
        Path.Combine(MemoryDirectory(accountId, memoryId), $"{photoId}.jpg");
}
