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

        public Task<RefreshToken?> GetAsync(string token) => _db.RefreshTokens
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.TokenHash == Hash(token) && x.RevokedAt == null);

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
