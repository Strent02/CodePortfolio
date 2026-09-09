using CodePortfolio.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly IProjectRepository    _projectRepo;
        private readonly IUserRepository       _userRepo;
        private readonly IJobOpeningRepository _jobRepo;

        public SearchController(
            IProjectRepository    projectRepo,
            IUserRepository       userRepo,
            IJobOpeningRepository jobRepo)
        {
            _projectRepo = projectRepo;
            _userRepo    = userRepo;
            _jobRepo     = jobRepo;
        }

        // GET api/search?q=...
        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q)) return BadRequest("Query required.");

            var projects  = await _projectRepo.Search(q);
            var users     = await _userRepo.Search(q);
            var vacancies = await _jobRepo.Search(q);

            return Ok(new
            {
                projects  = projects.Select(p => new { p.ProjectId, p.Title, p.Description, p.FeaturedImage, p.Status }),
                users     = users.Select(u => new { u.UserId, u.FullName, u.Bio, u.ProfilePicture }),
                vacancies = vacancies.Select(j => new { j.JobOpeningId, j.Title, j.Description, j.ContractType, j.WorkMode })
            });
        }
    }
}
