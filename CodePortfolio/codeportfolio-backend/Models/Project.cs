using System.ComponentModel.DataAnnotations;

namespace CodePortfolio.Models
{
    public class Project
    {
        [Key]
        public Guid ProjectId { get; set; }

        [Required(ErrorMessage = "User is required.")]
        public Guid UserId { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(150, ErrorMessage = "Title cannot exceed 150 characters.")]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime PublishDate { get; set; } = DateTime.UtcNow;

        [MaxLength(255)]
        public string? FeaturedImage { get; set; }

        [Url(ErrorMessage = "Invalid demo URL format.")]
        [MaxLength(255)]
        public string? DemoUrl { get; set; }

        [Url(ErrorMessage = "Invalid repository URL format.")]
        [MaxLength(255)]
        public string? RepositoryUrl { get; set; }

        [MaxLength(50)]
        public string? Status { get; set; }
    }
}
