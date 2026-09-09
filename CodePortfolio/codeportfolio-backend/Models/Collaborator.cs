using System.ComponentModel.DataAnnotations;

namespace CodePortfolio.Models
{
    public class Collaborator
    {
        [Key]
        public Guid CollaboratorId { get; set; }

        [Required(ErrorMessage = "User is required.")]
        public Guid UserId { get; set; }

        [Required(ErrorMessage = "Project is required.")]
        public Guid ProjectId { get; set; }

        [MaxLength(50)]
        public string? ProjectRole { get; set; }
    }
}
