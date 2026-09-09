using System.ComponentModel.DataAnnotations;

namespace CodePortfolio.Models
{
    public class Follow
    {
        [Key]
        public Guid FollowId { get; set; }

        [Required(ErrorMessage = "User is required.")]
        public Guid UserId { get; set; }

        public Guid? FollowedUserId { get; set; }

        public Guid? ProjectId { get; set; }

        public DateTime FollowDate { get; set; } = DateTime.UtcNow;
    }
}
