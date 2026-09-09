using System.ComponentModel.DataAnnotations;

namespace CodePortfolio.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Full name is required.")]
        [MaxLength(150, ErrorMessage = "Full name cannot exceed 150 characters.")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [MaxLength(150, ErrorMessage = "Email cannot exceed 150 characters.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { get; set; } = string.Empty;

        // Optional: if not provided, defaults to the "User" role
        public Guid? RoleId { get; set; }

        [MaxLength(100)]
        public string? Location { get; set; }

        public string? Bio { get; set; }
    }
}
