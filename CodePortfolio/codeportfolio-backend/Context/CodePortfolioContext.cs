using CodePortfolio.Models;
using Microsoft.EntityFrameworkCore;

namespace CodePortfolio.Context
{
    public class CodePortfolioContext : DbContext
    {
        public CodePortfolioContext(DbContextOptions<CodePortfolioContext> options)
            : base(options)
        {
        }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<JobOpening> JobOpenings { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Reaction> Reactions { get; set; }
        public DbSet<Follow> Follows { get; set; }
        public DbSet<Collaborator> Collaborators { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            /* =========================
               Role
            ========================= */
            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("Role");
                entity.HasKey(e => e.RoleId);
                entity.Property(e => e.RoleId)        .HasColumnName("role_id");
                entity.Property(e => e.Name)           .HasColumnName("name")        .IsRequired().HasMaxLength(50);
                entity.Property(e => e.Description)    .HasColumnName("description") .HasMaxLength(255);
            });

            /* =========================
               User
            ========================= */
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");
                entity.HasKey(e => e.UserId);
                entity.Property(e => e.UserId)          .HasColumnName("user_id");
                entity.Property(e => e.RoleId)          .HasColumnName("role_id");
                entity.Property(e => e.FullName)        .HasColumnName("full_name")         .IsRequired().HasMaxLength(150);
                entity.Property(e => e.Email)           .HasColumnName("email")             .IsRequired().HasMaxLength(150);
                entity.Property(e => e.Password)        .HasColumnName("password")          .IsRequired().HasMaxLength(150);
                entity.Property(e => e.Bio)             .HasColumnName("bio");
                entity.Property(e => e.Location)        .HasColumnName("location")          .HasMaxLength(100);
                entity.Property(e => e.RegistrationDate).HasColumnName("registration_date");
                entity.Property(e => e.ProfilePicture)  .HasColumnName("profile_picture")   .HasMaxLength(255);

                entity.HasOne<Role>()
                      .WithMany()
                      .HasForeignKey(e => e.RoleId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            /* =========================
               Company
            ========================= */
            modelBuilder.Entity<Company>(entity =>
            {
                entity.ToTable("Company");
                entity.HasKey(e => e.CompanyId);
                entity.Property(e => e.CompanyId)        .HasColumnName("company_id");
                entity.Property(e => e.Name)             .HasColumnName("name")              .IsRequired().HasMaxLength(150);
                entity.Property(e => e.Email)            .HasColumnName("email")             .IsRequired().HasMaxLength(150);
                entity.Property(e => e.Password)         .HasColumnName("password")          .IsRequired().HasMaxLength(150);
                entity.Property(e => e.Description)      .HasColumnName("description");
                entity.Property(e => e.Location)         .HasColumnName("location")          .HasMaxLength(100);
                entity.Property(e => e.RegistrationDate) .HasColumnName("registration_date");
                entity.Property(e => e.Logo)             .HasColumnName("logo")              .HasMaxLength(255);
            });

            /* =========================
               Project
            ========================= */
            modelBuilder.Entity<Project>(entity =>
            {
                entity.ToTable("Project");
                entity.HasKey(e => e.ProjectId);
                entity.Property(e => e.ProjectId)    .HasColumnName("project_id");
                entity.Property(e => e.UserId)       .HasColumnName("user_id");
                entity.Property(e => e.Title)        .HasColumnName("title")          .IsRequired().HasMaxLength(150);
                entity.Property(e => e.Description)  .HasColumnName("description");
                entity.Property(e => e.PublishDate)  .HasColumnName("publish_date");
                entity.Property(e => e.FeaturedImage).HasColumnName("featured_image") .HasMaxLength(255);
                entity.Property(e => e.DemoUrl)      .HasColumnName("demo_url")       .HasMaxLength(255);
                entity.Property(e => e.RepositoryUrl).HasColumnName("repository_url") .HasMaxLength(255);
                entity.Property(e => e.Status)       .HasColumnName("status")         .HasMaxLength(50);

                entity.HasOne<User>()
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            /* =========================
               JobOpening
            ========================= */
            modelBuilder.Entity<JobOpening>(entity =>
            {
                entity.ToTable("JobOpening");
                entity.HasKey(e => e.JobOpeningId);
                entity.Property(e => e.JobOpeningId) .HasColumnName("job_opening_id");
                entity.Property(e => e.CompanyId)    .HasColumnName("company_id");
                entity.Property(e => e.Title)        .HasColumnName("title")         .IsRequired().HasMaxLength(150);
                entity.Property(e => e.Description)  .HasColumnName("description");
                entity.Property(e => e.ContractType) .HasColumnName("contract_type") .HasMaxLength(50);
                entity.Property(e => e.WorkMode)     .HasColumnName("work_mode")     .HasMaxLength(50);
                entity.Property(e => e.PublishDate)  .HasColumnName("publish_date");

                entity.HasOne<Company>()
                      .WithMany()
                      .HasForeignKey(e => e.CompanyId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            /* =========================
               Application
            ========================= */
            modelBuilder.Entity<Application>(entity =>
            {
                entity.ToTable("Application");
                entity.HasKey(e => e.ApplicationId);
                entity.Property(e => e.ApplicationId) .HasColumnName("application_id");
                entity.Property(e => e.UserId)        .HasColumnName("user_id");
                entity.Property(e => e.JobOpeningId)  .HasColumnName("job_opening_id");
                entity.Property(e => e.CoverMessage)   .HasColumnName("cover_message");
                entity.Property(e => e.ApplicationDate) .HasColumnName("application_date");
                entity.Property(e => e.ProjectId)       .HasColumnName("project_id");
                entity.Property(e => e.Status)          .HasColumnName("status").HasMaxLength(50);

                entity.HasOne<User>()
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne<JobOpening>()
                      .WithMany()
                      .HasForeignKey(e => e.JobOpeningId)
                      .OnDelete(DeleteBehavior.NoAction);
            });

            /* =========================
               Comment
            ========================= */
            modelBuilder.Entity<Comment>(entity =>
            {
                entity.ToTable("Comment");
                entity.HasKey(e => e.CommentId);
                entity.Property(e => e.CommentId)  .HasColumnName("comment_id");
                entity.Property(e => e.UserId)     .HasColumnName("user_id");
                entity.Property(e => e.ProjectId)  .HasColumnName("project_id");
                entity.Property(e => e.Content)    .HasColumnName("content")     .IsRequired();
                entity.Property(e => e.CommentDate).HasColumnName("comment_date");

                entity.HasOne<User>()
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne<Project>()
                      .WithMany()
                      .HasForeignKey(e => e.ProjectId)
                      .OnDelete(DeleteBehavior.NoAction);
            });

            /* =========================
               Reaction
            ========================= */
            modelBuilder.Entity<Reaction>(entity =>
            {
                entity.ToTable("Reaction");
                entity.HasKey(e => e.ReactionId);
                entity.Property(e => e.ReactionId)  .HasColumnName("reaction_id");
                entity.Property(e => e.UserId)      .HasColumnName("user_id");
                entity.Property(e => e.ProjectId)   .HasColumnName("project_id");
                entity.Property(e => e.Type)        .HasColumnName("type")         .HasMaxLength(50);
                entity.Property(e => e.ReactionDate).HasColumnName("reaction_date");

                entity.HasOne<User>()
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne<Project>()
                      .WithMany()
                      .HasForeignKey(e => e.ProjectId)
                      .OnDelete(DeleteBehavior.NoAction);
            });

            /* =========================
               Follow
            ========================= */
            modelBuilder.Entity<Follow>(entity =>
            {
                entity.ToTable("Follow");
                entity.HasKey(e => e.FollowId);
                entity.Property(e => e.FollowId)      .HasColumnName("follow_id");
                entity.Property(e => e.UserId)        .HasColumnName("user_id");
                entity.Property(e => e.FollowedUserId).HasColumnName("followed_user_id");
                entity.Property(e => e.ProjectId)     .HasColumnName("project_id");
                entity.Property(e => e.FollowDate)    .HasColumnName("follow_date");
            });

            /* =========================
               Collaborator
            ========================= */
            modelBuilder.Entity<Collaborator>(entity =>
            {
                entity.ToTable("Collaborator");
                entity.HasKey(e => e.CollaboratorId);
                entity.Property(e => e.CollaboratorId).HasColumnName("collaborator_id");
                entity.Property(e => e.UserId)        .HasColumnName("user_id");
                entity.Property(e => e.ProjectId)     .HasColumnName("project_id");
                entity.Property(e => e.ProjectRole)   .HasColumnName("project_role").HasMaxLength(50);
            });

            /* =========================
               Message
            ========================= */
            modelBuilder.Entity<Message>(entity =>
            {
                entity.ToTable("Message");
                entity.HasKey(e => e.MessageId);
                entity.Property(e => e.MessageId) .HasColumnName("message_id");
                entity.Property(e => e.CompanyId) .HasColumnName("company_id");
                entity.Property(e => e.UserId)    .HasColumnName("user_id");
                entity.Property(e => e.Content)   .HasColumnName("content")     .IsRequired();
                entity.Property(e => e.SentDate)  .HasColumnName("sent_date");
                entity.Property(e => e.IsRead)    .HasColumnName("is_read");
                entity.Property(e => e.SenderType).HasColumnName("sender_type") .HasMaxLength(20);
            });

            /* =========================
               Notification
            ========================= */
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.ToTable("Notification");
                entity.HasKey(e => e.NotificationId);
                entity.Property(e => e.NotificationId).HasColumnName("notification_id");
                entity.Property(e => e.UserId)        .HasColumnName("user_id");
                entity.Property(e => e.CompanyId)     .HasColumnName("company_id");
                entity.Property(e => e.Message)       .HasColumnName("message")  .IsRequired();
                entity.Property(e => e.IsRead)        .HasColumnName("is_read");
                entity.Property(e => e.SentDate)      .HasColumnName("sent_date");
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
