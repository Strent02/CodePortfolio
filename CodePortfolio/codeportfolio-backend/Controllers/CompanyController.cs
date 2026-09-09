using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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
            return Ok(items);
        }

        [HttpGet("GetCompany/{id:guid}")]
        public async Task<IActionResult> GetCompany(Guid id)
        {
            var item = await _companyRepository.GetCompany(id);
            if (item == null) return NotFound("Company not found.");
            return Ok(item);
        }

        [HttpPost("CreateCompany")]
        public async Task<IActionResult> CreateCompany([FromBody] Company company)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            company.CompanyId = Guid.NewGuid();
            company.RegistrationDate = DateTime.UtcNow;

            var result = await _companyRepository.CreateCompany(company);
            if (!result) return BadRequest("Could not create company.");

            return CreatedAtAction(nameof(GetCompany), new { id = company.CompanyId }, company);
        }

        [HttpPut("UpdateCompany/{id:guid}")]
        public async Task<IActionResult> UpdateCompany(Guid id, [FromBody] Company company)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (id != company.CompanyId) return BadRequest("Company ID mismatch.");

            var result = await _companyRepository.UpdateCompany(company);
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
    }
}
