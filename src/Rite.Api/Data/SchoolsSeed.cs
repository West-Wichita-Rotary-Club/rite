using System.Text.Json;

namespace Rite.Api.Data;

// Mirrors docs/js/content.js's hardcoded `schools` array. That array has no
// docs/content/*.json file of its own, so it is embedded here rather than
// invented as a new file the static preview would also need to adopt.
internal static class SchoolsSeed
{
    private sealed record Localized(string En, string Es);

    private sealed record School(
        string Type, string Band, string Name, string Place, string Since, string Hosted, Localized Desc);

    private static readonly School[] Schools =
    [
        new("school", "azure", "Pleasant Valley Middle School", "Wichita, Kansas", "2004", "11",
            new("Host school for ESL co-teaching, cultural assemblies, and pen-pal projects.",
                "Escuela anfitriona para ESL, asambleas culturales y correspondencia.")),
        new("school", "turquoise", "Instituto Panamericano", "Panama City, Panama", "2006", "9",
            new("Long-standing partner sending bilingual educators to Wichita.",
                "Socio de larga data que envia docentes bilingues a Wichita.")),
        new("school", "cranberry", "Escuela Normal Superior de Mendoza", "Mendoza, Argentina", "2009", "8",
            new("Teacher-training institution represented in Argentina's RITE cohorts.",
                "Institucion de formacion docente representada en cohortes argentinas.")),
        new("club", "gold", "Rotary Club of West Wichita", "Wichita, Kansas", "1996", "30+",
            new("Founding club stewarding host families, travel support, and this archive.",
                "Club fundador que custodia familias anfitrionas, viajes y este archivo."))
    ];

    public static string ToJson()
    {
        var payload = new
        {
            schools = Schools.Select(s => new
            {
                type = s.Type,
                band = s.Band,
                name = s.Name,
                place = s.Place,
                since = s.Since,
                hosted = s.Hosted,
                desc = new { en = s.Desc.En, es = s.Desc.Es }
            })
        };
        return JsonSerializer.Serialize(payload);
    }
}
