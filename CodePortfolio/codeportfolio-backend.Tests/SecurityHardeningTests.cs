using System.ComponentModel.DataAnnotations;
using CodePortfolio.Controllers;
using CodePortfolio.DTOs;
using CodePortfolio.Helpers;
using Microsoft.AspNetCore.Http.Metadata;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace CodePortfolio.Tests;

public class SecurityHardeningTests
{
    [Fact]
    public void CredentialDtos_RejectOversizedInputs()
    {
        AssertInvalid(new LoginDto { Email = "user@example.com", Password = new string('x', 151) });
        AssertInvalid(new RegisterDto
        {
            FullName = "User", Email = "user@example.com", Password = new string('x', 151)
        });
        AssertInvalid(new RefreshTokenDto { RefreshToken = new string('x', 129) });
    }

    [Theory]
    [InlineData(typeof(ProjectController), "UploadImage")]
    [InlineData(typeof(UserController), "UploadAvatar")]
    public void UploadEndpoints_LimitMultipartRequestSize(Type controller, string methodName)
    {
        var method = controller.GetMethod(methodName)!;
        var requestLimit = Assert.Single(method.GetCustomAttributes(typeof(RequestSizeLimitAttribute), true)
            .Cast<RequestSizeLimitAttribute>());
        var formLimit = Assert.Single(method.GetCustomAttributes(typeof(RequestFormLimitsAttribute), true)
            .Cast<RequestFormLimitsAttribute>());

        var expected = ImageUploadHelper.MaxBytes + 64 * 1024;
        Assert.Equal(expected, ((IRequestSizeLimitMetadata)requestLimit).MaxRequestBodySize);
        Assert.Equal(expected, formLimit.MultipartBodyLengthLimit);
    }

    [Fact]
    public void AuthenticationResponses_AreNotCacheable()
    {
        var attribute = Assert.Single(typeof(AuthController)
            .GetCustomAttributes(typeof(ResponseCacheAttribute), true)
            .Cast<ResponseCacheAttribute>());

        Assert.True(attribute.NoStore);
        Assert.Equal(ResponseCacheLocation.None, attribute.Location);
    }

    private static void AssertInvalid(object instance)
    {
        var results = new List<ValidationResult>();
        Assert.False(Validator.TryValidateObject(instance, new ValidationContext(instance), results, true));
    }
}
