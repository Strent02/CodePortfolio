using System.IdentityModel.Tokens.Jwt;
using CodePortfolio.Models;
using CodePortfolio.Services;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace CodePortfolio.Tests;

public class JwtServiceTests
{
    [Fact]
    public void GenerateToken_IncludesUserAndRoleClaims()
    {
        var config = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["Jwt:Key"] = "a-development-test-key-with-more-than-32-bytes",
            ["Jwt:Issuer"] = "tests",
            ["Jwt:Audience"] = "tests",
            ["Jwt:ExpiresInMinutes"] = "15"
        }).Build();
        var user = new User
        {
            UserId = Guid.NewGuid(), RoleId = Guid.NewGuid(),
            FullName = "Test User", Email = "test@example.com"
        };

        var encoded = new JwtService(config).GenerateToken(user, "User");
        var token = new JwtSecurityTokenHandler().ReadJwtToken(encoded);

        Assert.Contains(token.Claims, c => c.Type == "userId" && c.Value == user.UserId.ToString());
        Assert.Contains(token.Claims, c => c.Type.EndsWith("/role") && c.Value == "User");
    }

    [Fact]
    public void GenerateRefreshToken_IsRandomAndHasEnoughEntropy()
    {
        var service = new JwtService(new ConfigurationBuilder().Build());
        var first = service.GenerateRefreshToken();
        var second = service.GenerateRefreshToken();

        Assert.NotEqual(first, second);
        Assert.Equal(64, Convert.FromBase64String(first).Length);
    }
}
