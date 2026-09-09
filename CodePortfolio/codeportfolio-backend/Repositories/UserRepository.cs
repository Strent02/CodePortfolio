using CodePortfolio.Context;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CodePortfolio.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly CodePortfolioContext _context;
        public UserRepository(CodePortfolioContext context) => _context = context;

        public async Task<List<User>> GetUsers() => await _context.Users.ToListAsync();

        public async Task<List<User>> Search(string query)
            => await _context.Users
                .Where(u => u.FullName.Contains(query) || u.Email.Contains(query))
                .ToListAsync();

        public async Task<User?> GetUser(Guid id) => await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
        public async Task<User?> GetUserByEmail(string email) => await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        public async Task<bool> CreateUser(User user)
        {
            _context.Users.Add(user);
            return await _context.SaveChangesAsync() > 0;
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
