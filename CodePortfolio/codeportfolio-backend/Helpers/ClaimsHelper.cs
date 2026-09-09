using System.Security.Claims;

namespace CodePortfolio.Helpers
{
    public static class ClaimsHelper
    {
        public static Guid GetUserId(ClaimsPrincipal user)
        {
            var val = user.FindFirstValue("userId")
                   ?? user.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(val, out var id) ? id : Guid.Empty;
        }

        public static string GetRole(ClaimsPrincipal user)
            => user.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

        public static bool IsAdmin(ClaimsPrincipal user)
            => user.IsInRole("Admin");
    }
}
