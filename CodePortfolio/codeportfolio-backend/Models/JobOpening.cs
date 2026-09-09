using System.ComponentModel.DataAnnotations;

namespace CodePortfolio.Models
{
    public class JobOpening
    {
        [Key]
        public Guid JobOpeningId { get; set; }

        [Required(ErrorMessage = "Company is required.")]
        public Guid CompanyId { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(150, ErrorMessage = "Title cannot exceed 150 characters.")]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [MaxLength(50)]
        public string? ContractType { get; set; }

        [MaxLength(50)]
        public string? WorkMode { get; set; }

        public DateTime PublishDate { get; set; } = DateTime.UtcNow;
    }
}
