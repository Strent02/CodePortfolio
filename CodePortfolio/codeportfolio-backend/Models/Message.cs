using System.ComponentModel.DataAnnotations;

namespace CodePortfolio.Models
{
    public class Message
    {
        [Key]
        public Guid MessageId { get; set; }

        [Required(ErrorMessage = "Company is required.")]
        public Guid CompanyId { get; set; }

        [Required(ErrorMessage = "User is required.")]
        public Guid UserId { get; set; }

        [Required(ErrorMessage = "Content is required.")]
        [MaxLength(2000, ErrorMessage = "Message cannot exceed 2000 characters.")]
        public string Content { get; set; } = string.Empty;

        public DateTime SentDate { get; set; } = DateTime.UtcNow;

        public bool IsRead { get; set; } = false;

        [Required(ErrorMessage = "Sender type is required.")]
        [RegularExpression("^(user|company)$", ErrorMessage = "SenderType must be 'user' or 'company'.")]
        [MaxLength(20)]
        public string SenderType { get; set; } = string.Empty;
    }
}
