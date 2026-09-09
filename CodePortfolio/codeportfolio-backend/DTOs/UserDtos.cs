using System.ComponentModel.DataAnnotations;

namespace CodePortfolio.DTOs
{
    public class UpdateProfileDto
    {
        [Required][MaxLength(150)] public string  FullName       { get; set; } = string.Empty;
        [MaxLength(500)]           public string? Bio            { get; set; }
        [MaxLength(100)]           public string? Location       { get; set; }
        [MaxLength(255)]           public string? ProfilePicture { get; set; }
    }

    public class ChangePasswordDto
    {
        [Required]               public string CurrentPassword { get; set; } = string.Empty;
        [Required][MinLength(6)] public string NewPassword     { get; set; } = string.Empty;
    }

    public class DeleteAccountDto
    {
        [Required(ErrorMessage = "Password is required to confirm account deletion.")]
        public string Password { get; set; } = string.Empty;
    }

    public class RefreshTokenDto
    {
        [Required] public string RefreshToken { get; set; } = string.Empty;
    }
}
