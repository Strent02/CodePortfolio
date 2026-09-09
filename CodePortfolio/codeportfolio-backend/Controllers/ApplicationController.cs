using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ApplicationController : ControllerBase
    {
        private readonly IApplicationRepository _applicationRepository;

        public ApplicationController(IApplicationRepository applicationRepository)
        {
            _applicationRepository = applicationRepository;
        }

        [HttpGet("GetApplications")]
        public async Task<IActionResult> GetApplications()
        {
            var items = await _applicationRepository.GetApplications();
            if (items == null || !items.Any())
                return NotFound("No applications found.");
            return Ok(items);
        }

        [HttpGet("GetApplication/{id:guid}")]
        public async Task<IActionResult> GetApplication(Guid id)
        {
            var item = await _applicationRepository.GetApplication(id);
            if (item == null) return NotFound("Application not found.");
            return Ok(item);
        }

        [HttpPost("CreateApplication")]
        public async Task<IActionResult> CreateApplication([FromBody] Application application)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            application.ApplicationId = Guid.NewGuid();
            application.ApplicationDate = DateTime.UtcNow;

            var result = await _applicationRepository.CreateApplication(application);
            if (!result) return Conflict("This user has already applied to this job opening.");

            return CreatedAtAction(nameof(GetApplication), new { id = application.ApplicationId }, application);
        }

        [HttpPut("UpdateApplication/{id:guid}")]
        public async Task<IActionResult> UpdateApplication(Guid id, [FromBody] Application application)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (id != application.ApplicationId) return BadRequest("Application ID mismatch.");

            var result = await _applicationRepository.UpdateApplication(application);
            if (!result) return NotFound("Application not found or could not be updated.");

            return Ok("Application updated successfully.");
        }

        [HttpDelete("DeleteApplication/{id:guid}")]
        public async Task<IActionResult> DeleteApplication(Guid id)
        {
            var result = await _applicationRepository.DeleteApplication(id);
            if (!result) return NotFound("Application not found or could not be deleted.");
            return Ok("Application deleted successfully.");
        }
    }
}
