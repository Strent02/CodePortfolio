using System.ComponentModel.DataAnnotations;

namespace CodePortfolio.DTOs
{
    public class CreateCompanyDto
    {
        [Required, MaxLength(150)] public string Name { get; set; } = string.Empty;
        [Required, EmailAddress, MaxLength(150)] public string Email { get; set; } = string.Empty;
        [Required, MinLength(8), MaxLength(150)] public string Password { get; set; } = string.Empty;
        [MaxLength(2000)] public string? Description { get; set; }
        [MaxLength(100)] public string? Location { get; set; }
        [MaxLength(255)] public string? Logo { get; set; }
    }

    public class UpdateCompanyDto
    {
        [Required, MaxLength(150)] public string Name { get; set; } = string.Empty;
        [Required, EmailAddress, MaxLength(150)] public string Email { get; set; } = string.Empty;
        [MinLength(8), MaxLength(150)] public string? Password { get; set; }
        [MaxLength(2000)] public string? Description { get; set; }
        [MaxLength(100)] public string? Location { get; set; }
        [MaxLength(255)] public string? Logo { get; set; }
    }
}
