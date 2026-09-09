using System.ComponentModel.DataAnnotations;

namespace CodePortfolio.DTOs
{
    public class CreateProjectDto
    {
        [Required][MaxLength(150)] public string  Title         { get; set; } = string.Empty;
        public string? Description  { get; set; }
        [MaxLength(255)]           public string? DemoUrl       { get; set; }
        [MaxLength(255)]           public string? RepositoryUrl { get; set; }
        [MaxLength(50)]            public string  Status        { get; set; } = "draft";
    }

    public class UpdateProjectDto
    {
        [Required][MaxLength(150)] public string  Title         { get; set; } = string.Empty;
        public string? Description  { get; set; }
        [MaxLength(255)]           public string? DemoUrl       { get; set; }
        [MaxLength(255)]           public string? RepositoryUrl { get; set; }
        [MaxLength(50)]            public string  Status        { get; set; } = "draft";
    }

    public class ProjectResponseDto
    {
        public Guid     ProjectId     { get; set; }
        public Guid     UserId        { get; set; }
        public string   AuthorName    { get; set; } = string.Empty;
        public string   Title         { get; set; } = string.Empty;
        public string?  Description   { get; set; }
        public DateTime PublishDate   { get; set; }
        public string?  FeaturedImage { get; set; }
        public string?  DemoUrl       { get; set; }
        public string?  RepositoryUrl { get; set; }
        public string?  Status        { get; set; }
        public int      Likes         { get; set; }
        public int      CommentsCount { get; set; }
    }

    public class CommentResponseDto
    {
        public Guid     CommentId   { get; set; }
        public Guid     UserId      { get; set; }
        public string   AuthorName  { get; set; } = string.Empty;
        public string   Content     { get; set; } = string.Empty;
        public DateTime CommentDate { get; set; }
    }

    public class CreateCommentDto
    {
        [Required][MaxLength(2000)] public string Content { get; set; } = string.Empty;
    }

    public class UserProfileDto
    {
        public Guid    UserId         { get; set; }
        public string  FullName       { get; set; } = string.Empty;
        // Email omitido del perfil público por privacidad
        public string? Bio            { get; set; }
        public string? Location       { get; set; }
        public string? ProfilePicture { get; set; }
        public int     ProjectsCount  { get; set; }
        public int     FollowersCount { get; set; }
        public int     FollowingCount { get; set; }
    }

    public class ApplyDto
    {
        [MaxLength(1000)] public string? CoverMessage { get; set; }
        public Guid? ProjectId { get; set; }
    }

    public class ChangeApplicationStatusDto
    {
        [Required]
        [RegularExpression("^(pending|accepted|rejected)$",
            ErrorMessage = "Status must be 'pending', 'accepted' or 'rejected'.")]
        public string Status { get; set; } = string.Empty;
    }

    public class CreateVacancyDto
    {
        [Required][MaxLength(150)] public string  Title        { get; set; } = string.Empty;
        public string? Description  { get; set; }
        [MaxLength(50)]            public string? ContractType { get; set; }
        [MaxLength(50)]            public string? WorkMode     { get; set; }
        [Required]                 public Guid    CompanyId    { get; set; }
    }
}
