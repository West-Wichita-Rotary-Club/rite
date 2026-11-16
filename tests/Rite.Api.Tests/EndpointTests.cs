using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Xunit;

namespace Rite.Api.Tests;

public class EndpointTests : IClassFixture<RiteApiFactory>
{
    private readonly HttpClient _client;

    public EndpointTests(RiteApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Health_returns_ok()
    {
        var response = await _client.GetAsync("/health");
        response.EnsureSuccessStatusCode();

        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("ok", body.GetProperty("status").GetString());
    }

    [Theory]
    [InlineData("/api/timeline", "milestones")]
    [InlineData("/api/stories", "stories")]
    [InlineData("/api/alumni", "profiles")]
    [InlineData("/api/resources", "resources")]
    [InlineData("/api/faq", "faqs")]
    [InlineData("/api/impact", "metrics")]
    [InlineData("/api/program-cycle", "phases")]
    [InlineData("/api/schools", "schools")]
    public async Task Content_endpoint_returns_real_data_with_the_expected_array(string path, string arrayProperty)
    {
        var response = await _client.GetAsync(path);
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);

        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        var items = body.GetProperty(arrayProperty);
        Assert.True(items.GetArrayLength() > 0, $"expected '{arrayProperty}' to be a non-empty array");
    }

    [Fact]
    public async Task Alumni_response_carries_both_languages_for_a_localized_field()
    {
        var response = await _client.GetAsync("/api/alumni");
        response.EnsureSuccessStatusCode();

        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        var firstProfile = body.GetProperty("profiles")[0];
        var summary = firstProfile.GetProperty("summary");

        Assert.False(string.IsNullOrWhiteSpace(summary.GetProperty("en").GetString()));
        Assert.False(string.IsNullOrWhiteSpace(summary.GetProperty("es").GetString()));
    }

    [Fact]
    public async Task Unknown_surface_returns_404()
    {
        var response = await _client.GetAsync("/api/nope");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
