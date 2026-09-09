using System.ComponentModel.DataAnnotations;

namespace CodePortfolio.Models
{
    public class Company
    {
        [Key]
        public Guid CompanyId { get; set; }

        [Required(ErrorMessage = "Company name is required.")]
        [MaxLength(150, ErrorMessage = "Company name cannot exceed 150 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        [MaxLength(150)]
        public string Password { get; set; } = string.Empty;

        public string? Description { get; set; }

        [MaxLength(100)]
        public string? Location { get; set; }

        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

        [MaxLength(255)]
        public string? Logo { get; set; }
    }
}
