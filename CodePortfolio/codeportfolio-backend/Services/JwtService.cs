using CodePortfolio.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CodePortfolio.Services
{
    public class JwtService
    {
        private readonly IConfiguration _config;
        public JwtService(IConfiguration config) => _config = config;

        public string GenerateToken(User user, string roleName)
        {
            var key     = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds   = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var minutes = double.Parse(_config["Jwt:ExpiresInMinutes"]!);
            var expires = DateTime.UtcNow.AddMinutes(minutes);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,   user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
                new Claim("userId",   user.UserId.ToString()),
                new Claim("fullName", user.FullName),
                new Claim("roleId",   user.RoleId.ToString()),
                new Claim(ClaimTypes.Role, roleName)
            };

            var token = new JwtSecurityToken(
                issuer:             _config["Jwt:Issuer"],
                audience:           _config["Jwt:Audience"],
                claims:             claims,
                expires:            expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Bug #2 fix: usar Concat para combinar los dos byte arrays correctamente
        // El operador '+' sobre byte[] en C# NO concatena — hace ToString() implícito
        public string GenerateRefreshToken()
        {
            var part1 = Guid.NewGuid().ToByteArray();
            var part2 = Guid.NewGuid().ToByteArray();
            var combined = part1.Concat(part2).ToArray(); // 32 bytes random
            return Convert.ToBase64String(combined);
        }
    }
}
