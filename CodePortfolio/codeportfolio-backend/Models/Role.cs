using System.ComponentModel.DataAnnotations;

namespace CodePortfolio.Models
{
    public class Role
    {
        [Key]
        public Guid RoleId { get; set; }

        [Required(ErrorMessage = "Role name is required.")]
        [MaxLength(50, ErrorMessage = "Role name cannot exceed 50 characters.")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? Description { get; set; }
    }
}
