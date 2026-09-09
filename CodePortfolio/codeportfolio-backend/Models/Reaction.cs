using System.ComponentModel.DataAnnotations;

namespace CodePortfolio.Models
{
    public class Reaction
    {
        [Key]
        public Guid ReactionId { get; set; }

        [Required(ErrorMessage = "User is required.")]
        public Guid UserId { get; set; }

        [Required(ErrorMessage = "Project is required.")]
        public Guid ProjectId { get; set; }

        [Required(ErrorMessage = "Reaction type is required.")]
        [MaxLength(50)]
        public string Type { get; set; } = string.Empty;

        public DateTime ReactionDate { get; set; } = DateTime.UtcNow;
    }
}
