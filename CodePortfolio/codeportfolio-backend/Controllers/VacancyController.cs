using CodePortfolio.DTOs;
using CodePortfolio.Helpers;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VacancyController : ControllerBase
    {
        private readonly IJobOpeningRepository  _jobRepo;
        private readonly IApplicationRepository _appRepo;
        private readonly IUserRepository        _userRepo;
        private readonly ICompanyRepository     _companyRepo;

        public VacancyController(IJobOpeningRepository jobRepo, IApplicationRepository appRepo,
            IUserRepository userRepo, ICompanyRepository companyRepo)
        {
            _jobRepo     = jobRepo;
            _appRepo     = appRepo;
            _userRepo    = userRepo;
            _companyRepo = companyRepo;
        }

        // GET api/vacancy — público, enriquecido con nombre de empresa
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetVacancies()
        {
            var jobs    = await _jobRepo.GetJobOpenings();
            var result  = new List<object>();
            foreach (var j in jobs)
            {
                var company = await _companyRepo.GetCompany(j.CompanyId);
                result.Add(new
                {
                    j.JobOpeningId, j.Title, j.Description,
                    j.ContractType, j.WorkMode, j.PublishDate,
                    companyName = company?.Name ?? "Unknown",
                    companyLogo = company?.Logo
                });
            }
            return Ok(result);
        }

        // GET api/vacancy/{id}
        [AllowAnonymous]
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetVacancy(Guid id)
        {
            var j = await _jobRepo.GetJobOpening(id);
            if (j == null) return NotFound("Vacancy not found.");
            var company = await _companyRepo.GetCompany(j.CompanyId);
            return Ok(new
            {
                j.JobOpeningId, j.Title, j.Description,
                j.ContractType, j.WorkMode, j.PublishDate,
                companyName = company?.Name ?? "Unknown",
                companyLogo = company?.Logo,
                companyLocation = company?.Location
            });
        }

        // GET api/vacancy/search?q=
        [AllowAnonymous]
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q)) return BadRequest("Query required.");
            var results = await _jobRepo.Search(q);
            return Ok(results.Select(j => new { j.JobOpeningId, j.Title, j.Description, j.ContractType, j.WorkMode }));
        }

        // POST api/vacancy/{id}/apply — usuario autenticado postula
        [Authorize]
        [HttpPost("{id:guid}/apply")]
        public async Task<IActionResult> Apply(Guid id, [FromBody] ApplyDto dto)
        {
            var userId = ClaimsHelper.GetUserId(User);
            var job    = await _jobRepo.GetJobOpening(id);
            if (job == null) return NotFound("Vacancy not found.");

            var app = new Application
            {
                ApplicationId   = Guid.NewGuid(),
                UserId          = userId,
                JobOpeningId    = id,
                ProjectId       = dto.ProjectId,
                CoverMessage    = dto.CoverMessage,
                ApplicationDate = DateTime.UtcNow,
                Status          = "pending"
            };

            if (!await _appRepo.CreateApplication(app))
                return Conflict("You have already applied to this vacancy.");

            return Ok(new { app.ApplicationId, app.Status, message = "Application submitted successfully." });
        }

        // GET api/vacancy/my-applications — historial del usuario
        [Authorize]
        [HttpGet("my-applications")]
        public async Task<IActionResult> MyApplications()
        {
            var userId = ClaimsHelper.GetUserId(User);
            var apps   = await _appRepo.GetApplicationsByUser(userId);
            var result = new List<object>();
            foreach (var a in apps)
            {
                var job     = await _jobRepo.GetJobOpening(a.JobOpeningId);
                var company = job != null ? await _companyRepo.GetCompany(job.CompanyId) : null;
                result.Add(new
                {
                    a.ApplicationId, a.Status, a.ApplicationDate, a.CoverMessage,
                    jobTitle    = job?.Title ?? "Unknown",
                    companyName = company?.Name ?? "Unknown"
                });
            }
            return Ok(result);
        }

        // GET api/vacancy/{id}/applications — Recruiter o Admin
        [Authorize(Roles = "Recruiter,Admin")]
        [HttpGet("{id:guid}/applications")]
        public async Task<IActionResult> GetApplications(Guid id)
        {
            var apps   = await _appRepo.GetApplicationsByJobOpening(id);
            var result = new List<object>();
            foreach (var a in apps)
            {
                var u = await _userRepo.GetUser(a.UserId);
                result.Add(new
                {
                    a.ApplicationId, a.UserId, a.CoverMessage,
                    a.ApplicationDate, a.Status, a.ProjectId,
                    applicantName    = u?.FullName,
                    applicantPicture = u?.ProfilePicture
                });
            }
            return Ok(result);
        }

        // PUT api/vacancy/application/{appId}/status — Recruiter o Admin
        [Authorize(Roles = "Recruiter,Admin")]
        [HttpPut("application/{appId:guid}/status")]
        public async Task<IActionResult> ChangeStatus(Guid appId, [FromBody] ChangeApplicationStatusDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (!await _appRepo.ChangeStatus(appId, dto.Status)) return NotFound("Application not found.");
            return Ok(new { appId, dto.Status });
        }

        // POST api/vacancy — Recruiter o Admin
        [Authorize(Roles = "Recruiter,Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateVacancy([FromBody] CreateVacancyDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var job = new JobOpening
            {
                JobOpeningId = Guid.NewGuid(),
                CompanyId    = dto.CompanyId,
                Title        = dto.Title,
                Description  = dto.Description,
                ContractType = dto.ContractType,
                WorkMode     = dto.WorkMode,
                PublishDate  = DateTime.UtcNow
            };
            if (!await _jobRepo.CreateJobOpening(job)) return BadRequest("Could not create vacancy.");
            return CreatedAtAction(nameof(GetVacancy), new { id = job.JobOpeningId }, job);
        }
    }
}
