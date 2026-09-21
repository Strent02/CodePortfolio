using CodePortfolio.Context;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace CodePortfolio.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly CodePortfolioContext _context;
        public UserRepository(CodePortfolioContext context) => _context = context;

        public async Task<List<User>> GetUsers() => await _context.Users.ToListAsync();

        public async Task<List<User>> Search(string query)
            => await _context.Users
                // El correo es privado; no debe funcionar como índice público de usuarios.
                .Where(u => u.FullName.Contains(query))
                .AsNoTracking()
                .ToListAsync();

        public async Task<List<User>> GetUsersByIds(IEnumerable<Guid> userIds)
        {
            var ids = userIds.Distinct().ToArray();
            return await _context.Users.Where(u => ids.Contains(u.UserId)).AsNoTracking().ToListAsync();
        }

        public async Task<User?> GetUser(Guid id) => await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
        public async Task<User?> GetUserByEmail(string email) => await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        public async Task<bool> CreateUser(User user)
        {
            _context.Users.Add(user);
            try
            {
                return await _context.SaveChangesAsync() > 0;
            }
            catch (DbUpdateException ex) when (ex.InnerException is PostgresException
                { SqlState: PostgresErrorCodes.UniqueViolation })
            {
                _context.Entry(user).State = EntityState.Detached;
                return false;
            }
        }

        public async Task<bool> UpdateUser(User user)
        {
            _context.Users.Update(user);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteUser(Guid id)
        {
            var u = await GetUser(id);
            if (u == null) return false;
            _context.Users.Remove(u);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
