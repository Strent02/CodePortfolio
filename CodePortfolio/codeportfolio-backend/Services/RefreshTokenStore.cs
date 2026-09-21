using System.Security.Cryptography;
using System.Text;
using CodePortfolio.Context;
using CodePortfolio.Models;
using Microsoft.EntityFrameworkCore;

namespace CodePortfolio.Services
{
    public class RefreshTokenStore
    {
        private readonly CodePortfolioContext _db;
        public RefreshTokenStore(CodePortfolioContext db) => _db = db;

        public async Task SaveAsync(string token, Guid userId, DateTime expiry)
        {
            _db.RefreshTokens.Add(new RefreshToken
            {
                RefreshTokenId = Guid.NewGuid(),
                UserId = userId,
                TokenHash = Hash(token),
                ExpiresAt = expiry
            });
            await _db.SaveChangesAsync();
        }

        // Consume el token mediante un UPDATE condicional. Dos solicitudes concurrentes
        // no pueden rotar el mismo refresh token: solo una consigue actualizar una fila.
        public async Task<RefreshToken?> ConsumeAsync(string token)
        {
            var hash = Hash(token);
            var now = DateTime.UtcNow;
            var consumed = await _db.RefreshTokens
                .Where(x => x.TokenHash == hash && x.RevokedAt == null && x.ExpiresAt > now)
                .ExecuteUpdateAsync(update => update.SetProperty(x => x.RevokedAt, now));

            if (consumed != 1) return null;

            return await _db.RefreshTokens
                .AsNoTracking()
                .FirstAsync(x => x.TokenHash == hash);
        }

        public async Task RevokeAsync(string token)
        {
            var hash = Hash(token);
            var entry = await _db.RefreshTokens.FirstOrDefaultAsync(x => x.TokenHash == hash && x.RevokedAt == null);
            if (entry == null) return;
            entry.RevokedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }

        public async Task RevokeAllAsync(Guid userId)
        {
            var entries = await _db.RefreshTokens.Where(x => x.UserId == userId && x.RevokedAt == null).ToListAsync();
            foreach (var entry in entries) entry.RevokedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }

        private static string Hash(string token) => Convert.ToHexString(
            SHA256.HashData(Encoding.UTF8.GetBytes(token)));
    }
}
