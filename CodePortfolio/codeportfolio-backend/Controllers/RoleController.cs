using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RoleController : ControllerBase
    {
        private readonly IRoleRepository _roleRepository;

        public RoleController(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        [HttpGet("GetRoles")]
        public async Task<IActionResult> GetRoles()
        {
            var items = await _roleRepository.GetRoles();
            if (items == null || !items.Any())
                return NotFound("No roles found.");
            return Ok(items);
        }

        [HttpGet("GetRole/{id:guid}")]
        public async Task<IActionResult> GetRole(Guid id)
        {
            var item = await _roleRepository.GetRole(id);
            if (item == null) return NotFound("Role not found.");
            return Ok(item);
        }

        [AllowAnonymous]
        [HttpPost("CreateRole")]
        public async Task<IActionResult> CreateRole([FromBody] Role role)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            role.RoleId = Guid.NewGuid();

            var result = await _roleRepository.CreateRole(role);
            if (!result) return BadRequest("Could not create role.");

            return CreatedAtAction(nameof(GetRole), new { id = role.RoleId }, role);
        }

        [HttpPut("UpdateRole/{id:guid}")]
        public async Task<IActionResult> UpdateRole(Guid id, [FromBody] Role role)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (id != role.RoleId) return BadRequest("Role ID mismatch.");

            var result = await _roleRepository.UpdateRole(role);
            if (!result) return NotFound("Role not found or could not be updated.");

            return Ok("Role updated successfully.");
        }

        [HttpDelete("DeleteRole/{id:guid}")]
        public async Task<IActionResult> DeleteRole(Guid id)
        {
            var result = await _roleRepository.DeleteRole(id);
            if (!result) return NotFound("Role not found or could not be deleted.");
            return Ok("Role deleted successfully.");
        }
    }
}
