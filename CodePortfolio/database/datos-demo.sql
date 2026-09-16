--
-- PostgreSQL database dump
--

\restrict MGSTyIv1HZTbSeM7CsUgpOhhQKPtJBNV2gppeRBX7M4I7T6RuDb4IuqffJ25XnO

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
    CONSTRAINT "Application_status_check" CHECK (((status)::text = ANY (ARRAY[('pending'::character varying)::text, ('accepted'::character varying)::text, ('rejected'::character varying)::text])))
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
    CONSTRAINT "Message_sender_type_check" CHECK (((sender_type)::text = ANY (ARRAY[('user'::character varying)::text, ('company'::character varying)::text])))
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
    CONSTRAINT "Project_status_check" CHECK (((status)::text = ANY (ARRAY[('draft'::character varying)::text, ('published'::character varying)::text])))
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
-- Data for Name: Application; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Application" (application_id, user_id, job_opening_id, project_id, cover_message, application_date, status) FROM stdin;
\.


--
-- Data for Name: Collaborator; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Collaborator" (collaborator_id, user_id, project_id, project_role) FROM stdin;
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Comment" (comment_id, user_id, project_id, content, comment_date) FROM stdin;
63ad2dbd-999e-44c9-b5b3-5453f5ecf072	e8502b83-9ce6-4eaa-bfdc-dff94ea71880	96880cd0-2541-4b06-8dd4-9c19ea826676	El manejo de ligaduras es impecable. ¿Publicarás el algoritmo de guionado por separado?	2026-09-09 12:29:08.234924-05
75b4573a-47ea-47b1-b756-8f39c032043f	beed05ce-701b-4040-984f-8f7992ec6225	2f58040c-b720-4de3-aa0a-53a4230f53ae	Muy limpio: cero dependencias en tiempo de ejecución.	2026-09-09 12:29:08.234924-05
\.


--
-- Data for Name: Company; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Company" (company_id, name, email, password, description, location, registration_date, logo) FROM stdin;
f2f4fc49-e5f7-4c83-aa31-fc458f49a558	Talleres Corvino	rrhh@corvino.test	$2a$11$KCBOb9BQFTvZcXC3c0s0Teb2l.iK6GuvS/Mf0jd5FZ4iFUyRRgmSe	Estudio de ingeniería de plataforma.	Bogotá, Colombia	2026-09-09 11:41:16.6848-05	\N
\.


--
-- Data for Name: Follow; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Follow" (follow_id, user_id, followed_user_id, project_id, follow_date) FROM stdin;
dae20c49-9557-4a14-b54e-e56dc9642033	e8502b83-9ce6-4eaa-bfdc-dff94ea71880	beed05ce-701b-4040-984f-8f7992ec6225	\N	2026-09-09 12:29:08.239501-05
b5a42eb9-a062-4b63-8375-99ea66faa4f1	beed05ce-701b-4040-984f-8f7992ec6225	e8502b83-9ce6-4eaa-bfdc-dff94ea71880	\N	2026-09-09 12:29:08.239501-05
\.


--
-- Data for Name: JobOpening; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."JobOpening" (job_opening_id, company_id, title, description, contract_type, work_mode, publish_date) FROM stdin;
7a70bd72-642c-47d6-a3d3-375d59ef0710	f2f4fc49-e5f7-4c83-aa31-fc458f49a558	Ingeniero de plataforma senior	Diseñarás y mantendrás la infraestructura de despliegue continuo sobre Kubernetes.	full-time	remote	2026-09-09 11:41:16.722743-05
3963c7c0-d79c-4490-8c97-1eaa746ade5b	f2f4fc49-e5f7-4c83-aa31-fc458f49a558	Desarrollador front-end	Interfaces accesibles y rápidas para clientes del sector editorial.	freelance	hybrid	2026-09-09 11:41:16.754481-05
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Message" (message_id, company_id, user_id, content, sent_date, is_read, sender_type) FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Notification" (notification_id, user_id, company_id, message, is_read, sent_date) FROM stdin;
7de72ea1-0047-40cb-8c9d-e12df5407256	beed05ce-701b-4040-984f-8f7992ec6225	\N	Grace Hopper comentó tu proyecto «Motor de composición tipográfica».	f	2026-09-09 12:29:08.241002-05
90f3c67c-fb0e-45e1-9cd9-f5430e5d4f44	beed05ce-701b-4040-984f-8f7992ec6225	\N	A Grace Hopper le gustó tu proyecto «Motor de composición tipográfica».	f	2026-09-09 12:29:08.241002-05
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Project" (project_id, user_id, title, description, publish_date, featured_image, demo_url, repository_url, status) FROM stdin;
2f58040c-b720-4de3-aa0a-53a4230f53ae	e8502b83-9ce6-4eaa-bfdc-dff94ea71880	Compilador de plantillas	Transforma plantillas declarativas en funciones puras de JavaScript, sin dependencias en tiempo de ejecución.	2026-09-09 11:43:30.593032-05	\N	https://demo.ejemplo.dev	https://github.com/ada/proyecto	published
96880cd0-2541-4b06-8dd4-9c19ea826676	beed05ce-701b-4040-984f-8f7992ec6225	Motor de composición tipográfica	Compone texto justificado con guionado Knuth-Plass. Escrito en Rust y compilado a WebAssembly; cabe en 40 KB.	2026-09-09 11:43:41.740754-05	/images/projects/96880cd0-2541-4b06-8dd4-9c19ea826676.png	https://demo.ejemplo.dev	https://github.com/ada/proyecto	published
d281735c-5d52-4529-bc34-de5297bad5dd	beed05ce-701b-4040-984f-8f7992ec6225	Atlas de series temporales	Base de datos columnar para métricas, con compresión delta-of-delta y consultas por debajo del milisegundo.	2026-09-09 11:43:46.166913-05	\N	https://demo.ejemplo.dev	https://github.com/ada/proyecto	draft
\.


--
-- Data for Name: Reaction; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Reaction" (reaction_id, user_id, project_id, type, reaction_date) FROM stdin;
7c008d4e-95eb-4544-bfdf-20c713477d1b	e8502b83-9ce6-4eaa-bfdc-dff94ea71880	96880cd0-2541-4b06-8dd4-9c19ea826676	like	2026-09-09 12:29:08.237604-05
a6f9d921-e299-4b32-9e99-07875c23a357	beed05ce-701b-4040-984f-8f7992ec6225	2f58040c-b720-4de3-aa0a-53a4230f53ae	like	2026-09-09 12:29:08.237604-05
\.


--
-- Data for Name: RefreshToken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RefreshToken" (refresh_token_id, user_id, token_hash, expires_at, created_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Role" (role_id, name, description) FROM stdin;
0af91311-34cf-4511-9671-3944fe4a62f8	User	Default user role
5f57c709-0140-4350-9ce1-fcf6030f55c4	Recruiter	Recruiter role
3f67fc16-8aed-418b-a4c5-da57978b21dc	Admin	Administrator role
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (user_id, role_id, full_name, email, password, bio, location, registration_date, profile_picture) FROM stdin;
a53d9ced-bbac-4f6c-97c9-a70c22867f58	3f67fc16-8aed-418b-a4c5-da57978b21dc	Administrator	admin@codeportfolio.test	$2a$11$osa5.tUX5bZHj/rL05p2ZuzQIsR6R/Y5yXAthiVxDyIC33UgHRFUC	\N	\N	2026-09-09 11:37:00.948482-05	\N
e8502b83-9ce6-4eaa-bfdc-dff94ea71880	0af91311-34cf-4511-9671-3944fe4a62f8	Grace Hopper	grace@demo.test	$2a$11$CaSpAI1rCkXy53tqXB6Ege1/akmCFCKVsX6Y/aqdTyWT8lNPqDDAy	Lenguajes y herramientas de desarrollo.	Cali, Colombia	2026-09-09 11:43:26.39109-05	\N
beed05ce-701b-4040-984f-8f7992ec6225	0af91311-34cf-4511-9671-3944fe4a62f8	Ada Lovelace	ada@demo.test	$2a$11$2fJuse4rwhbLXjdxLyGU0e/H50Ca31evPgxMHkLLkr0RJyrZ02ddG	Ingeniera de sistemas. Escribo compiladores y herramientas de composición tipográfica.	Bogotá, Colombia	2026-09-09 11:43:37.01655-05	/images/avatars/beed05ce-701b-4040-984f-8f7992ec6225_1788972231.png
\.


--
-- Data for Name: __EFMigrationsHistory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") FROM stdin;
20260909000000_InitialPostgreSql	8.0.11
20260909165011_CascadeDeleteDependientes	8.0.11
\.


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

\unrestrict MGSTyIv1HZTbSeM7CsUgpOhhQKPtJBNV2gppeRBX7M4I7T6RuDb4IuqffJ25XnO

