using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class JobOpeningController : ControllerBase
    {
        private readonly IJobOpeningRepository _jobOpeningRepository;

        public JobOpeningController(IJobOpeningRepository jobOpeningRepository)
        {
            _jobOpeningRepository = jobOpeningRepository;
        }

        [HttpGet("GetJobOpenings")]
        public async Task<IActionResult> GetJobOpenings()
        {
            var items = await _jobOpeningRepository.GetJobOpenings();
            if (items == null || !items.Any())
                return NotFound("No jobOpenings found.");
            return Ok(items);
        }

        [HttpGet("GetJobOpening/{id:guid}")]
        public async Task<IActionResult> GetJobOpening(Guid id)
        {
            var item = await _jobOpeningRepository.GetJobOpening(id);
            if (item == null) return NotFound("JobOpening not found.");
            return Ok(item);
        }

        [HttpPost("CreateJobOpening")]
        public async Task<IActionResult> CreateJobOpening([FromBody] JobOpening jobOpening)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            jobOpening.JobOpeningId = Guid.NewGuid();
            jobOpening.PublishDate = DateTime.UtcNow;

            var result = await _jobOpeningRepository.CreateJobOpening(jobOpening);
            if (!result) return BadRequest("Could not create jobOpening.");

            return CreatedAtAction(nameof(GetJobOpening), new { id = jobOpening.JobOpeningId }, jobOpening);
        }

        [HttpPut("UpdateJobOpening/{id:guid}")]
        public async Task<IActionResult> UpdateJobOpening(Guid id, [FromBody] JobOpening jobOpening)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (id != jobOpening.JobOpeningId) return BadRequest("JobOpening ID mismatch.");

            var result = await _jobOpeningRepository.UpdateJobOpening(jobOpening);
            if (!result) return NotFound("JobOpening not found or could not be updated.");

            return Ok("JobOpening updated successfully.");
        }

        [HttpDelete("DeleteJobOpening/{id:guid}")]
        public async Task<IActionResult> DeleteJobOpening(Guid id)
        {
            var result = await _jobOpeningRepository.DeleteJobOpening(id);
            if (!result) return NotFound("JobOpening not found or could not be deleted.");
            return Ok("JobOpening deleted successfully.");
        }
    }
}
