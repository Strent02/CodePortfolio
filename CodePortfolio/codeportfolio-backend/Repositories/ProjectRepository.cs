using CodePortfolio.Context;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CodePortfolio.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly CodePortfolioContext _context;
        public ProjectRepository(CodePortfolioContext context) => _context = context;

        public async Task<List<Project>> GetProjects()
            => await _context.Projects.OrderByDescending(p => p.PublishDate).ToListAsync();

        public async Task<List<Project>> GetPublicProjects()
            => await _context.Projects
                .Where(p => p.Status == "published")
                .OrderByDescending(p => p.PublishDate)
                .ToListAsync();

        public async Task<List<Project>> GetProjectsByUser(Guid userId)
            => await _context.Projects
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.PublishDate)
                .ToListAsync();

        public async Task<List<Project>> GetFeed(int skip, int take)
            => await _context.Projects
                .Where(p => p.Status == "published")
                .OrderByDescending(p => p.PublishDate)
                .Skip(skip).Take(take)
                .ToListAsync();

        public async Task<List<Project>> GetFeedForUser(Guid userId, int skip, int take)
        {
            var followedIds = await _context.Follows
                .Where(f => f.UserId == userId && f.FollowedUserId.HasValue)
                .Select(f => f.FollowedUserId!.Value)
                .ToListAsync();

            return await _context.Projects
                .Where(p => followedIds.Contains(p.UserId) && p.Status == "published")
                .OrderByDescending(p => p.PublishDate)
                .Skip(skip).Take(take)
                .ToListAsync();
        }

        public async Task<List<Project>> Search(string query)
            => await _context.Projects
                .Where(p => p.Status == "published" &&
                            (p.Title.Contains(query) || (p.Description != null && p.Description.Contains(query))))
                .OrderByDescending(p => p.PublishDate)
                .ToListAsync();

        public async Task<Project?> GetProject(Guid projectId)
            => await _context.Projects.FirstOrDefaultAsync(p => p.ProjectId == projectId);

        public async Task<bool> CreateProject(Project project)
        {
            _context.Projects.Add(project);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateProject(Project project)
        {
            _context.Projects.Update(project);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteProject(Guid projectId)
        {
            var p = await GetProject(projectId);
            if (p == null) return false;
            _context.Projects.Remove(p);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
