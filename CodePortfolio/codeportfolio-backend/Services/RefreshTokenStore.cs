namespace CodePortfolio.Services
{
    /// <summary>
    /// In-memory refresh token store.
    /// Para producción real reemplazar por tabla en DB o Redis.
    /// </summary>
    public class RefreshTokenStore
    {
        private readonly Dictionary<string, RefreshEntry> _store = new();
        private readonly object _lock = new();

        public void Save(string refreshToken, Guid userId, DateTime expiry)
        {
            lock (_lock)
                _store[refreshToken] = new RefreshEntry(userId, expiry);
        }

        public RefreshEntry? Get(string refreshToken)
        {
            lock (_lock)
                return _store.TryGetValue(refreshToken, out var e) ? e : null;
        }

        public void Revoke(string refreshToken)
        {
            lock (_lock) _store.Remove(refreshToken);
        }
    }

    public record RefreshEntry(Guid UserId, DateTime Expiry);
}
