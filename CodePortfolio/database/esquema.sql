--
-- PostgreSQL database dump
--

\restrict HKbn9D2BM4P43ZgPQtJBT3gMkKd9uW4BiDvwpg790WBiYOjbUgXkIczqRdjzvLx

-- Dumped from database version 16.15 (Homebrew)
-- Dumped by pg_dump version 16.15 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Application; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Application" (
    application_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    job_opening_id uuid NOT NULL,
    project_id uuid,
    cover_message character varying(1000),
    application_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    CONSTRAINT "Application_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'rejected'::character varying])::text[])))
);


--
-- Name: Collaborator; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Collaborator" (
    collaborator_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    project_id uuid NOT NULL,
    project_role character varying(50)
);


--
-- Name: Comment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Comment" (
    comment_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    project_id uuid NOT NULL,
    content character varying(2000) NOT NULL,
    comment_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Company; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Company" (
    company_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(150) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(150) NOT NULL,
    description text,
    location character varying(100),
    registration_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    logo character varying(255)
);


--
-- Name: Follow; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Follow" (
    follow_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    followed_user_id uuid,
    project_id uuid,
    follow_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT ck_follow_not_self CHECK (((followed_user_id IS NULL) OR (user_id <> followed_user_id))),
    CONSTRAINT ck_follow_target CHECK (((followed_user_id IS NOT NULL) OR (project_id IS NOT NULL)))
);


--
-- Name: JobOpening; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."JobOpening" (
    job_opening_id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    title character varying(150) NOT NULL,
    description text,
    contract_type character varying(50),
    work_mode character varying(50),
    publish_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Message; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Message" (
    message_id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    user_id uuid NOT NULL,
    content character varying(2000) NOT NULL,
    sent_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    sender_type character varying(20) NOT NULL,
    CONSTRAINT "Message_sender_type_check" CHECK (((sender_type)::text = ANY ((ARRAY['user'::character varying, 'company'::character varying])::text[])))
);


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Notification" (
    notification_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    company_id uuid,
    message character varying(500) NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    sent_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT ck_notification_recipient CHECK (((user_id IS NULL) <> (company_id IS NULL)))
);


--
-- Name: Project; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Project" (
    project_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title character varying(150) NOT NULL,
    description text,
    publish_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    featured_image character varying(255),
    demo_url character varying(255),
    repository_url character varying(255),
    status character varying(50),
    CONSTRAINT "Project_status_check" CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'published'::character varying])::text[])))
);


--
-- Name: Reaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Reaction" (
    reaction_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    project_id uuid NOT NULL,
    type character varying(50) DEFAULT 'like'::character varying NOT NULL,
    reaction_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: RefreshToken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RefreshToken" (
    refresh_token_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token_hash character varying(64) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    revoked_at timestamp with time zone
);


--
-- Name: Role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Role" (
    role_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(255)
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_id uuid NOT NULL,
    full_name character varying(150) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(150) NOT NULL,
    bio character varying(500),
    location character varying(100),
    registration_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    profile_picture character varying(255)
);


--
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


--
-- Name: Application Application_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Application"
    ADD CONSTRAINT "Application_pkey" PRIMARY KEY (application_id);


--
-- Name: Collaborator Collaborator_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Collaborator"
    ADD CONSTRAINT "Collaborator_pkey" PRIMARY KEY (collaborator_id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (comment_id);


--
-- Name: Company Company_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_email_key" UNIQUE (email);


--
-- Name: Company Company_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_pkey" PRIMARY KEY (company_id);


--
-- Name: Follow Follow_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_pkey" PRIMARY KEY (follow_id);


--
-- Name: JobOpening JobOpening_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JobOpening"
    ADD CONSTRAINT "JobOpening_pkey" PRIMARY KEY (job_opening_id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (message_id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (notification_id);


--
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (project_id);


--
-- Name: Reaction Reaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reaction"
    ADD CONSTRAINT "Reaction_pkey" PRIMARY KEY (reaction_id);


--
-- Name: RefreshToken RefreshToken_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY (refresh_token_id);


--
-- Name: RefreshToken RefreshToken_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_token_hash_key" UNIQUE (token_hash);


--
-- Name: Role Role_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_name_key" UNIQUE (name);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (role_id);


--
-- Name: User User_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key" UNIQUE (email);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (user_id);


--
-- Name: Application uq_application_user_job; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Application"
    ADD CONSTRAINT uq_application_user_job UNIQUE (user_id, job_opening_id);


--
-- Name: Collaborator uq_collaborator_user_project; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Collaborator"
    ADD CONSTRAINT uq_collaborator_user_project UNIQUE (user_id, project_id);


--
-- Name: Follow uq_follow_users; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT uq_follow_users UNIQUE (user_id, followed_user_id);


--
-- Name: Reaction uq_reaction_user_project; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reaction"
    ADD CONSTRAINT uq_reaction_user_project UNIQUE (user_id, project_id);


--
-- Name: ix_comment_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_comment_project_id ON public."Comment" USING btree (project_id);


--
-- Name: ix_job_opening_company_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_job_opening_company_id ON public."JobOpening" USING btree (company_id);


--
-- Name: ix_notification_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_notification_user_id ON public."Notification" USING btree (user_id);


--
-- Name: ix_project_publish_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_project_publish_date ON public."Project" USING btree (publish_date DESC);


--
-- Name: ix_project_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_project_user_id ON public."Project" USING btree (user_id);


--
-- Name: ix_refresh_token_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_refresh_token_user_id ON public."RefreshToken" USING btree (user_id);


--
-- Name: Application Application_job_opening_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Application"
    ADD CONSTRAINT "Application_job_opening_id_fkey" FOREIGN KEY (job_opening_id) REFERENCES public."JobOpening"(job_opening_id) ON DELETE RESTRICT;


--
-- Name: Application Application_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Application"
    ADD CONSTRAINT "Application_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public."Project"(project_id) ON DELETE SET NULL;


--
-- Name: Application Application_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Application"
    ADD CONSTRAINT "Application_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON DELETE CASCADE;


--
-- Name: Collaborator Collaborator_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Collaborator"
    ADD CONSTRAINT "Collaborator_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public."Project"(project_id) ON DELETE CASCADE;


--
-- Name: Collaborator Collaborator_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Collaborator"
    ADD CONSTRAINT "Collaborator_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON DELETE CASCADE;


--
-- Name: Comment Comment_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public."Project"(project_id) ON DELETE CASCADE;


--
-- Name: Comment Comment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON DELETE CASCADE;


--
-- Name: Follow Follow_followed_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_followed_user_id_fkey" FOREIGN KEY (followed_user_id) REFERENCES public."User"(user_id) ON DELETE CASCADE;


--
-- Name: Follow Follow_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public."Project"(project_id) ON DELETE SET NULL;


--
-- Name: Follow Follow_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON DELETE CASCADE;


--
-- Name: JobOpening JobOpening_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JobOpening"
    ADD CONSTRAINT "JobOpening_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public."Company"(company_id) ON DELETE CASCADE;


--
-- Name: Message Message_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public."Company"(company_id) ON DELETE CASCADE;


--
-- Name: Message Message_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON DELETE CASCADE;


--
-- Name: Notification Notification_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public."Company"(company_id) ON DELETE CASCADE;


--
-- Name: Notification Notification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON DELETE CASCADE;


--
-- Name: Project Project_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON DELETE CASCADE;


--
-- Name: Reaction Reaction_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reaction"
    ADD CONSTRAINT "Reaction_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public."Project"(project_id) ON DELETE CASCADE;


--
-- Name: Reaction Reaction_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reaction"
    ADD CONSTRAINT "Reaction_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON DELETE CASCADE;


--
-- Name: RefreshToken RefreshToken_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON DELETE CASCADE;


--
-- Name: User User_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public."Role"(role_id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict HKbn9D2BM4P43ZgPQtJBT3gMkKd9uW4BiDvwpg790WBiYOjbUgXkIczqRdjzvLx

