using System.ComponentModel.DataAnnotations;

namespace CodePortfolio.Models
{
    public class Notification : IValidatableObject
    {
        [Key]
        public Guid NotificationId { get; set; }

        public Guid? UserId { get; set; }

        public Guid? CompanyId { get; set; }

        [Required(ErrorMessage = "Message is required.")]
        [MaxLength(500, ErrorMessage = "Notification message cannot exceed 500 characters.")]
        public string Message { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        public DateTime SentDate { get; set; } = DateTime.UtcNow;

        // Matches DB constraint: exactly one of UserId or CompanyId must be set
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            bool hasUser    = UserId.HasValue;
            bool hasCompany = CompanyId.HasValue;

            if (!hasUser && !hasCompany)
                yield return new ValidationResult(
                    "Either UserId or CompanyId must be provided.",
                    new[] { nameof(UserId), nameof(CompanyId) });

            if (hasUser && hasCompany)
                yield return new ValidationResult(
                    "Only one of UserId or CompanyId can be set, not both.",
                    new[] { nameof(UserId), nameof(CompanyId) });
        }
    }
}
