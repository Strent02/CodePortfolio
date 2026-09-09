using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CollaboratorController : ControllerBase
    {
        private readonly ICollaboratorRepository _collaboratorRepository;

        public CollaboratorController(ICollaboratorRepository collaboratorRepository)
        {
            _collaboratorRepository = collaboratorRepository;
        }

        [HttpGet("GetCollaborators")]
        public async Task<IActionResult> GetCollaborators()
        {
            var items = await _collaboratorRepository.GetCollaborators();
            if (items == null || !items.Any())
                return NotFound("No collaborators found.");
            return Ok(items);
        }

        [HttpGet("GetCollaborator/{id:guid}")]
        public async Task<IActionResult> GetCollaborator(Guid id)
        {
            var item = await _collaboratorRepository.GetCollaborator(id);
            if (item == null) return NotFound("Collaborator not found.");
            return Ok(item);
        }

        [HttpPost("CreateCollaborator")]
        public async Task<IActionResult> CreateCollaborator([FromBody] Collaborator collaborator)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            collaborator.CollaboratorId = Guid.NewGuid();

            var result = await _collaboratorRepository.CreateCollaborator(collaborator);
            if (!result) return Conflict("This user is already a collaborator on this project.");

            return CreatedAtAction(nameof(GetCollaborator), new { id = collaborator.CollaboratorId }, collaborator);
        }

        [HttpPut("UpdateCollaborator/{id:guid}")]
        public async Task<IActionResult> UpdateCollaborator(Guid id, [FromBody] Collaborator collaborator)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (id != collaborator.CollaboratorId) return BadRequest("Collaborator ID mismatch.");

            var result = await _collaboratorRepository.UpdateCollaborator(collaborator);
            if (!result) return NotFound("Collaborator not found or could not be updated.");

            return Ok("Collaborator updated successfully.");
        }

        [HttpDelete("DeleteCollaborator/{id:guid}")]
        public async Task<IActionResult> DeleteCollaborator(Guid id)
        {
            var result = await _collaboratorRepository.DeleteCollaborator(id);
            if (!result) return NotFound("Collaborator not found or could not be deleted.");
            return Ok("Collaborator deleted successfully.");
        }
    }
}
