using CodePortfolio.Context;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CodePortfolio.Repositories
{
    public class CollaboratorRepository : ICollaboratorRepository
    {
        private readonly CodePortfolioContext _context;

        public CollaboratorRepository(CodePortfolioContext context)
        {
            _context = context;
        }

        public async Task<List<Collaborator>> GetCollaborators()
        {
            return await _context.Collaborators.ToListAsync();
        }

        public async Task<Collaborator?> GetCollaborator(Guid collaboratorId)
        {
            return await _context.Collaborators
                .FirstOrDefaultAsync(x => x.CollaboratorId == collaboratorId);
        }

        public async Task<bool> CreateCollaborator(Collaborator collaborator)
        {
            // Enforce UQ_Collaborator_User_Project
            var exists = await _context.Collaborators.AnyAsync(c =>
                c.UserId == collaborator.UserId &&
                c.ProjectId == collaborator.ProjectId);
            if (exists) return false;

            _context.Collaborators.Add(collaborator);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateCollaborator(Collaborator collaborator)
        {
            _context.Collaborators.Update(collaborator);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteCollaborator(Guid collaboratorId)
        {
            var entity = await GetCollaborator(collaboratorId);
            if (entity == null) return false;

            _context.Collaborators.Remove(entity);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
