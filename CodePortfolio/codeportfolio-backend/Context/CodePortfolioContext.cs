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
        public DbSet<RefreshToken> RefreshTokens { get; set; }

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
                entity.HasIndex(e => e.Name).IsUnique();
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
                entity.HasIndex(e => e.Email).IsUnique();

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
                entity.HasIndex(e => e.Email).IsUnique();
            });

            /* =========================
               Project
            ========================= */
            modelBuilder.Entity<Project>(entity =>
            {
                entity.ToTable("Project", table =>
                    table.HasCheckConstraint("CK_Project_Status", "status IS NULL OR status IN ('draft', 'published')"));
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
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.PublishDate);

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
                entity.HasIndex(e => e.CompanyId);

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
                entity.ToTable("Application", table =>
                    table.HasCheckConstraint("CK_Application_Status", "status IN ('pending', 'accepted', 'rejected')"));
                entity.HasKey(e => e.ApplicationId);
                entity.Property(e => e.ApplicationId) .HasColumnName("application_id");
                entity.Property(e => e.UserId)        .HasColumnName("user_id");
                entity.Property(e => e.JobOpeningId)  .HasColumnName("job_opening_id");
                entity.Property(e => e.CoverMessage)   .HasColumnName("cover_message");
                entity.Property(e => e.ApplicationDate) .HasColumnName("application_date");
                entity.Property(e => e.ProjectId)       .HasColumnName("project_id");
                entity.Property(e => e.Status)          .HasColumnName("status").HasMaxLength(50);
                entity.HasIndex(e => new { e.UserId, e.JobOpeningId }).IsUnique();

                entity.HasOne<User>()
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne<JobOpening>()
                      .WithMany()
                      .HasForeignKey(e => e.JobOpeningId)
                      .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne<Project>()
                      .WithMany()
                      .HasForeignKey(e => e.ProjectId)
                      .OnDelete(DeleteBehavior.SetNull);
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
                entity.HasIndex(e => e.ProjectId);

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
                entity.ToTable("Reaction", table =>
                    table.HasCheckConstraint("CK_Reaction_Type", "type = 'like'"));
                entity.HasKey(e => e.ReactionId);
                entity.Property(e => e.ReactionId)  .HasColumnName("reaction_id");
                entity.Property(e => e.UserId)      .HasColumnName("user_id");
                entity.Property(e => e.ProjectId)   .HasColumnName("project_id");
                entity.Property(e => e.Type)        .HasColumnName("type")         .HasMaxLength(50);
                entity.Property(e => e.ReactionDate).HasColumnName("reaction_date");
                entity.HasIndex(e => new { e.UserId, e.ProjectId }).IsUnique();

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
                entity.ToTable("Follow", table =>
                {
                    table.HasCheckConstraint("CK_Follow_Target", "followed_user_id IS NOT NULL OR project_id IS NOT NULL");
                    table.HasCheckConstraint("CK_Follow_NotSelf", "followed_user_id IS NULL OR user_id <> followed_user_id");
                });
                entity.HasKey(e => e.FollowId);
                entity.Property(e => e.FollowId)      .HasColumnName("follow_id");
                entity.Property(e => e.UserId)        .HasColumnName("user_id");
                entity.Property(e => e.FollowedUserId).HasColumnName("followed_user_id");
                entity.Property(e => e.ProjectId)     .HasColumnName("project_id");
                entity.Property(e => e.FollowDate)    .HasColumnName("follow_date");
                entity.HasIndex(e => new { e.UserId, e.FollowedUserId }).IsUnique();

                entity.HasOne<User>().WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne<User>().WithMany().HasForeignKey(e => e.FollowedUserId).OnDelete(DeleteBehavior.NoAction);
                entity.HasOne<Project>().WithMany().HasForeignKey(e => e.ProjectId).OnDelete(DeleteBehavior.SetNull);
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
                entity.HasIndex(e => new { e.UserId, e.ProjectId }).IsUnique();
                entity.HasOne<User>().WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne<Project>().WithMany().HasForeignKey(e => e.ProjectId).OnDelete(DeleteBehavior.Cascade);
            });

            /* =========================
               Message
            ========================= */
            modelBuilder.Entity<Message>(entity =>
            {
                entity.ToTable("Message", table =>
                    table.HasCheckConstraint("CK_Message_Sender", "sender_type IN ('user', 'company')"));
                entity.HasKey(e => e.MessageId);
                entity.Property(e => e.MessageId) .HasColumnName("message_id");
                entity.Property(e => e.CompanyId) .HasColumnName("company_id");
                entity.Property(e => e.UserId)    .HasColumnName("user_id");
                entity.Property(e => e.Content)   .HasColumnName("content")     .IsRequired();
                entity.Property(e => e.SentDate)  .HasColumnName("sent_date");
                entity.Property(e => e.IsRead)    .HasColumnName("is_read");
                entity.Property(e => e.SenderType).HasColumnName("sender_type") .HasMaxLength(20);
                entity.HasOne<User>().WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne<Company>().WithMany().HasForeignKey(e => e.CompanyId).OnDelete(DeleteBehavior.Cascade);
            });

            /* =========================
               Notification
            ========================= */
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.ToTable("Notification", table =>
                    table.HasCheckConstraint("CK_Notification_Recipient", "(user_id IS NULL) <> (company_id IS NULL)"));
                entity.HasKey(e => e.NotificationId);
                entity.Property(e => e.NotificationId).HasColumnName("notification_id");
                entity.Property(e => e.UserId)        .HasColumnName("user_id");
                entity.Property(e => e.CompanyId)     .HasColumnName("company_id");
                entity.Property(e => e.Message)       .HasColumnName("message")  .IsRequired();
                entity.Property(e => e.IsRead)        .HasColumnName("is_read");
                entity.Property(e => e.SentDate)      .HasColumnName("sent_date");
                entity.HasIndex(e => e.UserId);
                entity.HasOne<User>().WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne<Company>().WithMany().HasForeignKey(e => e.CompanyId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.ToTable("RefreshToken");
                entity.HasKey(e => e.RefreshTokenId);
                entity.Property(e => e.RefreshTokenId).HasColumnName("refresh_token_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.TokenHash).HasColumnName("token_hash").HasMaxLength(64).IsRequired();
                entity.Property(e => e.ExpiresAt).HasColumnName("expires_at");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.RevokedAt).HasColumnName("revoked_at");
                entity.HasIndex(e => e.TokenHash).IsUnique();
                entity.HasIndex(e => e.UserId);
                entity.HasOne<User>().WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
