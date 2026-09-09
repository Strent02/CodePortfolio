using System.ComponentModel.DataAnnotations;

namespace CodePortfolio.Models
{
    public class Comment
    {
        [Key]
        public Guid CommentId { get; set; }

        [Required(ErrorMessage = "User is required.")]
        public Guid UserId { get; set; }

        [Required(ErrorMessage = "Project is required.")]
        public Guid ProjectId { get; set; }

        [Required(ErrorMessage = "Content is required.")]
        [MaxLength(2000, ErrorMessage = "Comment cannot exceed 2000 characters.")]
        public string Content { get; set; } = string.Empty;

        public DateTime CommentDate { get; set; } = DateTime.UtcNow;
    }
}
