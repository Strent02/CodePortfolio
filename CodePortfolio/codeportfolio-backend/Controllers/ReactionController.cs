using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReactionController : ControllerBase
    {
        private readonly IReactionRepository _reactionRepository;

        public ReactionController(IReactionRepository reactionRepository)
        {
            _reactionRepository = reactionRepository;
        }

        [HttpGet("GetReactions")]
        public async Task<IActionResult> GetReactions()
        {
            var items = await _reactionRepository.GetReactions();
            if (items == null || !items.Any())
                return NotFound("No reactions found.");
            return Ok(items);
        }

        [HttpGet("GetReaction/{id:guid}")]
        public async Task<IActionResult> GetReaction(Guid id)
        {
            var item = await _reactionRepository.GetReaction(id);
            if (item == null) return NotFound("Reaction not found.");
            return Ok(item);
        }

        [HttpPost("CreateReaction")]
        public async Task<IActionResult> CreateReaction([FromBody] Reaction reaction)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            reaction.ReactionId = Guid.NewGuid();
            reaction.ReactionDate = DateTime.UtcNow;

            var result = await _reactionRepository.CreateReaction(reaction);
            if (!result) return Conflict("This user has already reacted to this project.");

            return CreatedAtAction(nameof(GetReaction), new { id = reaction.ReactionId }, reaction);
        }

        [HttpPut("UpdateReaction/{id:guid}")]
        public async Task<IActionResult> UpdateReaction(Guid id, [FromBody] Reaction reaction)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (id != reaction.ReactionId) return BadRequest("Reaction ID mismatch.");

            var result = await _reactionRepository.UpdateReaction(reaction);
            if (!result) return NotFound("Reaction not found or could not be updated.");

            return Ok("Reaction updated successfully.");
        }

        [HttpDelete("DeleteReaction/{id:guid}")]
        public async Task<IActionResult> DeleteReaction(Guid id)
        {
            var result = await _reactionRepository.DeleteReaction(id);
            if (!result) return NotFound("Reaction not found or could not be deleted.");
            return Ok("Reaction deleted successfully.");
        }
    }
}
