-- CodePortfolio - PostgreSQL 16 schema
-- Adapted from the original SQL Server export and aligned with the current API.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS "Role" (
    role_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(50) NOT NULL UNIQUE,
    description varchar(255)
);

CREATE TABLE IF NOT EXISTS "User" (
    user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id uuid NOT NULL REFERENCES "Role"(role_id) ON DELETE RESTRICT,
    full_name varchar(150) NOT NULL,
    email varchar(150) NOT NULL UNIQUE,
    password varchar(150) NOT NULL,
    bio varchar(500),
    location varchar(100),
    registration_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    profile_picture varchar(255)
);

CREATE TABLE IF NOT EXISTS "Company" (
    company_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(150) NOT NULL,
    email varchar(150) NOT NULL UNIQUE,
    password varchar(150) NOT NULL,
    description text,
    location varchar(100),
    registration_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    logo varchar(255)
);

CREATE TABLE IF NOT EXISTS "Project" (
    project_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES "User"(user_id) ON DELETE CASCADE,
    title varchar(150) NOT NULL,
    description text,
    publish_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    featured_image varchar(255),
    demo_url varchar(255),
    repository_url varchar(255),
    status varchar(50) CHECK (status IN ('draft', 'published'))
);
CREATE INDEX IF NOT EXISTS ix_project_user_id ON "Project"(user_id);
CREATE INDEX IF NOT EXISTS ix_project_publish_date ON "Project"(publish_date DESC);

CREATE TABLE IF NOT EXISTS "JobOpening" (
    job_opening_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES "Company"(company_id) ON DELETE CASCADE,
    title varchar(150) NOT NULL,
    description text,
    contract_type varchar(50),
    work_mode varchar(50),
    publish_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS ix_job_opening_company_id ON "JobOpening"(company_id);

CREATE TABLE IF NOT EXISTS "Application" (
    application_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES "User"(user_id) ON DELETE CASCADE,
    job_opening_id uuid NOT NULL REFERENCES "JobOpening"(job_opening_id) ON DELETE RESTRICT,
    project_id uuid REFERENCES "Project"(project_id) ON DELETE SET NULL,
    cover_message varchar(1000),
    application_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status varchar(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'rejected')),
    CONSTRAINT uq_application_user_job UNIQUE (user_id, job_opening_id)
);

CREATE TABLE IF NOT EXISTS "Comment" (
    comment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES "User"(user_id) ON DELETE CASCADE,
    project_id uuid NOT NULL REFERENCES "Project"(project_id) ON DELETE RESTRICT,
    content varchar(2000) NOT NULL,
    comment_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS ix_comment_project_id ON "Comment"(project_id);

CREATE TABLE IF NOT EXISTS "Reaction" (
    reaction_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES "User"(user_id) ON DELETE CASCADE,
    project_id uuid NOT NULL REFERENCES "Project"(project_id) ON DELETE RESTRICT,
    type varchar(50) NOT NULL DEFAULT 'like',
    reaction_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_reaction_user_project UNIQUE (user_id, project_id)
);

CREATE TABLE IF NOT EXISTS "Follow" (
    follow_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES "User"(user_id) ON DELETE CASCADE,
    followed_user_id uuid REFERENCES "User"(user_id) ON DELETE RESTRICT,
    project_id uuid REFERENCES "Project"(project_id) ON DELETE SET NULL,
    follow_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_follow_target CHECK (followed_user_id IS NOT NULL OR project_id IS NOT NULL),
    CONSTRAINT ck_follow_not_self CHECK (followed_user_id IS NULL OR user_id <> followed_user_id),
    CONSTRAINT uq_follow_users UNIQUE (user_id, followed_user_id)
);

CREATE TABLE IF NOT EXISTS "Collaborator" (
    collaborator_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES "User"(user_id) ON DELETE CASCADE,
    project_id uuid NOT NULL REFERENCES "Project"(project_id) ON DELETE CASCADE,
    project_role varchar(50),
    CONSTRAINT uq_collaborator_user_project UNIQUE (user_id, project_id)
);

CREATE TABLE IF NOT EXISTS "Message" (
    message_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES "Company"(company_id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES "User"(user_id) ON DELETE CASCADE,
    content varchar(2000) NOT NULL,
    sent_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_read boolean NOT NULL DEFAULT false,
    sender_type varchar(20) NOT NULL CHECK (sender_type IN ('user', 'company'))
);

CREATE TABLE IF NOT EXISTS "Notification" (
    notification_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES "User"(user_id) ON DELETE CASCADE,
    company_id uuid REFERENCES "Company"(company_id) ON DELETE CASCADE,
    message varchar(500) NOT NULL,
    is_read boolean NOT NULL DEFAULT false,
    sent_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_notification_recipient CHECK ((user_id IS NULL) <> (company_id IS NULL))
);
CREATE INDEX IF NOT EXISTS ix_notification_user_id ON "Notification"(user_id);

CREATE TABLE IF NOT EXISTS "RefreshToken" (
    refresh_token_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES "User"(user_id) ON DELETE CASCADE,
    token_hash varchar(64) NOT NULL UNIQUE,
    expires_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at timestamptz
);
CREATE INDEX IF NOT EXISTS ix_refresh_token_user_id ON "RefreshToken"(user_id);

INSERT INTO "Role" (name, description) VALUES
    ('User', 'Default user role'),
    ('Recruiter', 'Recruiter role'),
    ('Admin', 'Administrator role')
ON CONFLICT (name) DO NOTHING;
