using CodePortfolio.Controllers;
using CodePortfolio.DTOs;
using Microsoft.AspNetCore.Authorization;
using Xunit;

namespace CodePortfolio.Tests;

public class AuthorizationPolicyTests
{
    [Fact]
    public void PublicRegistration_CannotChooseARole()
    {
        Assert.Null(typeof(RegisterDto).GetProperty("RoleId"));
    }

    [Theory]
    [InlineData(typeof(RoleController))]
    [InlineData(typeof(ApplicationController))]
    [InlineData(typeof(CompanyController))]
    [InlineData(typeof(JobOpeningController))]
    [InlineData(typeof(MessageController))]
    [InlineData(typeof(ReactionController))]
    public void AdministrativeCrud_RequiresAdminRole(Type controllerType)
    {
        var authorize = controllerType.GetCustomAttributes(typeof(AuthorizeAttribute), true)
            .Cast<AuthorizeAttribute>().Single();

        Assert.Equal("Admin", authorize.Roles);
    }
}
