using System.ComponentModel.DataAnnotations;

namespace CodePortfolio.Models
{
    public class Application
    {
        [Key]
        public Guid ApplicationId { get; set; }

        [Required] public Guid UserId       { get; set; }
        [Required] public Guid JobOpeningId { get; set; }

        public Guid? ProjectId { get; set; }   // linked project from applicant

        [MaxLength(1000)] public string? CoverMessage { get; set; }

        public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;

        [MaxLength(50)] public string Status { get; set; } = "pending"; // pending|accepted|rejected
    }
}
