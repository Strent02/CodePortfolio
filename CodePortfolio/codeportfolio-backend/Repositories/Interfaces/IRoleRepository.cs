using CodePortfolio.Models;

namespace CodePortfolio.Repositories.Interfaces
{
    public interface IRoleRepository
    {
        Task<List<Role>> GetRoles();
        Task<Role?> GetRole(Guid roleId);
        Task<Role?> GetRoleByName(string name);
        Task<bool> CreateRole(Role role);
        Task<bool> UpdateRole(Role role);
        Task<bool> DeleteRole(Guid roleId);
    }
}
