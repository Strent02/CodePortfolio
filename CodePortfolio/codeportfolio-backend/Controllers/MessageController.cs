using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly IMessageRepository _messageRepository;

        public MessageController(IMessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }

        [HttpGet("GetMessages")]
        public async Task<IActionResult> GetMessages()
        {
            var items = await _messageRepository.GetMessages();
            if (items == null || !items.Any())
                return NotFound("No messages found.");
            return Ok(items);
        }

        [HttpGet("GetMessage/{id:guid}")]
        public async Task<IActionResult> GetMessage(Guid id)
        {
            var item = await _messageRepository.GetMessage(id);
            if (item == null) return NotFound("Message not found.");
            return Ok(item);
        }

        [HttpPost("CreateMessage")]
        public async Task<IActionResult> CreateMessage([FromBody] Message message)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            message.MessageId = Guid.NewGuid();
            message.SentDate = DateTime.UtcNow;

            var result = await _messageRepository.CreateMessage(message);
            if (!result) return BadRequest("Could not create message.");

            return CreatedAtAction(nameof(GetMessage), new { id = message.MessageId }, message);
        }

        [HttpPut("UpdateMessage/{id:guid}")]
        public async Task<IActionResult> UpdateMessage(Guid id, [FromBody] Message message)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (id != message.MessageId) return BadRequest("Message ID mismatch.");

            var result = await _messageRepository.UpdateMessage(message);
            if (!result) return NotFound("Message not found or could not be updated.");

            return Ok("Message updated successfully.");
        }

        [HttpDelete("DeleteMessage/{id:guid}")]
        public async Task<IActionResult> DeleteMessage(Guid id)
        {
            var result = await _messageRepository.DeleteMessage(id);
            if (!result) return NotFound("Message not found or could not be deleted.");
            return Ok("Message deleted successfully.");
        }
    }
}
