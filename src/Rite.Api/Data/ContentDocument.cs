namespace Rite.Api.Data;

// One row per content surface, storing that surface's content verbatim as JSON.
// Deliberately not normalized into per-field relational columns yet: the seven
// docs/content/*.json files (and the schools list) vary too much in nested shape
// (e.g. alumni participation is either years[] or a range{}) to commit to a fixed
// schema before any real consumer has driven actual query needs.
public class ContentDocument
{
    public required string Surface { get; set; }
    public required string Json { get; set; }
    public required DateTimeOffset SeededAt { get; set; }
}
