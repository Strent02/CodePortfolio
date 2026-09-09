using CodePortfolio.Context;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CodePortfolio.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly CodePortfolioContext _context;

        public RoleRepository(CodePortfolioContext context)
        {
            _context = context;
        }

        public async Task<List<Role>> GetRoles()
        {
            return await _context.Roles.ToListAsync();
        }

        public async Task<Role?> GetRole(Guid roleId)
        {
            return await _context.Roles
                .FirstOrDefaultAsync(x => x.RoleId == roleId);
        }

        public async Task<Role?> GetRoleByName(string name)
        {
            return await _context.Roles
                .FirstOrDefaultAsync(x => x.Name.ToLower() == name.ToLower());
        }

        public async Task<bool> CreateRole(Role role)
        {
            _context.Roles.Add(role);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateRole(Role role)
        {
            _context.Roles.Update(role);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteRole(Guid roleId)
        {
            var entity = await GetRole(roleId);
            if (entity == null) return false;

            _context.Roles.Remove(entity);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
