using CodePortfolio.Models;

namespace CodePortfolio.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<List<User>> GetUsers();
        Task<List<User>> Search(string query);
        Task<User?> GetUser(Guid userId);
        Task<User?> GetUserByEmail(string email);
        Task<bool> CreateUser(User user);
        Task<bool> UpdateUser(User user);
        Task<bool> DeleteUser(Guid userId);
    }
}
