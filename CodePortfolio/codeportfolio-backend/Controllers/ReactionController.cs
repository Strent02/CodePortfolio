using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
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
                return NotFound("No hay reacciones.");
            return Ok(items);
        }

        [HttpGet("GetReaction/{id:guid}")]
        public async Task<IActionResult> GetReaction(Guid id)
        {
            var item = await _reactionRepository.GetReaction(id);
            if (item == null) return NotFound("Reacción no encontrada.");
            return Ok(item);
        }

        [HttpPost("CreateReaction")]
        public async Task<IActionResult> CreateReaction([FromBody] Reaction reaction)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            reaction.ReactionId = Guid.NewGuid();
            reaction.ReactionDate = DateTime.UtcNow;

            var result = await _reactionRepository.CreateReaction(reaction);
            if (!result) return Conflict("Ya reaccionaste a este proyecto.");

            return CreatedAtAction(nameof(GetReaction), new { id = reaction.ReactionId }, reaction);
        }

        [HttpPut("UpdateReaction/{id:guid}")]
        public async Task<IActionResult> UpdateReaction(Guid id, [FromBody] Reaction reaction)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (id != reaction.ReactionId) return BadRequest("El identificador de la reacción no coincide.");

            var result = await _reactionRepository.UpdateReaction(reaction);
            if (!result) return NotFound("No se encontró la reacción o no se pudo actualizar.");

            return Ok("Reacción actualizada.");
        }

        [HttpDelete("DeleteReaction/{id:guid}")]
        public async Task<IActionResult> DeleteReaction(Guid id)
        {
            var result = await _reactionRepository.DeleteReaction(id);
            if (!result) return NotFound("No se encontró la reacción o no se pudo eliminar.");
            return Ok("Reacción eliminada.");
        }
    }
}
