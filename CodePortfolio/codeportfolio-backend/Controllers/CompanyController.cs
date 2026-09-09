using CodePortfolio.Models;
using CodePortfolio.DTOs;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyRepository _companyRepository;

        public CompanyController(ICompanyRepository companyRepository)
        {
            _companyRepository = companyRepository;
        }

        [HttpGet("GetCompanies")]
        public async Task<IActionResult> GetCompanies()
        {
            var items = await _companyRepository.GetCompanies();
            if (items == null || !items.Any())
                return NotFound("No companys found.");
            return Ok(items.Select(ToResponse));
        }

        [HttpGet("GetCompany/{id:guid}")]
        public async Task<IActionResult> GetCompany(Guid id)
        {
            var item = await _companyRepository.GetCompany(id);
            if (item == null) return NotFound("Company not found.");
            return Ok(ToResponse(item));
        }

        [HttpPost("CreateCompany")]
        public async Task<IActionResult> CreateCompany([FromBody] CreateCompanyDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var company = new Company
            {
                CompanyId = Guid.NewGuid(),
                Name = dto.Name,
                Email = dto.Email.Trim().ToLowerInvariant(),
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Description = dto.Description,
                Location = dto.Location,
                Logo = dto.Logo,
                RegistrationDate = DateTime.UtcNow
            };

            var result = await _companyRepository.CreateCompany(company);
            if (!result) return BadRequest("Could not create company.");

            return CreatedAtAction(nameof(GetCompany), new { id = company.CompanyId }, ToResponse(company));
        }

        [HttpPut("UpdateCompany/{id:guid}")]
        public async Task<IActionResult> UpdateCompany(Guid id, [FromBody] UpdateCompanyDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var existing = await _companyRepository.GetCompany(id);
            if (existing == null) return NotFound("Company not found.");
            existing.Name = dto.Name;
            existing.Email = dto.Email.Trim().ToLowerInvariant();
            existing.Description = dto.Description;
            existing.Location = dto.Location;
            existing.Logo = dto.Logo;
            if (!string.IsNullOrWhiteSpace(dto.Password))
                existing.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var result = await _companyRepository.UpdateCompany(existing);
            if (!result) return NotFound("Company not found or could not be updated.");

            return Ok("Company updated successfully.");
        }

        [HttpDelete("DeleteCompany/{id:guid}")]
        public async Task<IActionResult> DeleteCompany(Guid id)
        {
            var result = await _companyRepository.DeleteCompany(id);
            if (!result) return NotFound("Company not found or could not be deleted.");
            return Ok("Company deleted successfully.");
        }

        private static object ToResponse(Company company) => new
        {
            company.CompanyId,
            company.Name,
            company.Email,
            company.Description,
            company.Location,
            company.RegistrationDate,
            company.Logo
        };
    }
}
