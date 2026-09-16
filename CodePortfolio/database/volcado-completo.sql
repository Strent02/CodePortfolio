--
-- PostgreSQL database dump
--

\restrict atOFSITU8GxFKihnalhcQWj0w6ujMof9dAqUSFX8c3arHfhQ7iZXFyWIPIqXWnC

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
-- Data for Name: Application; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Application" (application_id, user_id, job_opening_id, project_id, cover_message, application_date, status) FROM stdin;
1c5af4db-b6cb-4d4f-92ad-d62f48797ab2	1cd81ea9-aa7e-43dd-972d-0dda870457b8	3963c7c0-d79c-4490-8c97-1eaa746ade5b	\N	Cinco años en infraestructura de despliegue continuo.	2026-09-09 11:42:18.928497-05	pending
6ad5d592-b515-45ec-b628-cc9942cf40dc	dc29ca0b-fb29-4b59-b91d-9d5ee36ea0e0	3963c7c0-d79c-4490-8c97-1eaa746ade5b	\N	confidencial de B	2026-09-09 11:53:07.999388-05	pending
5c99bebf-986d-48d0-a837-17f83594abf2	ca8881e8-e657-496c-9120-b96c7402c112	3963c7c0-d79c-4490-8c97-1eaa746ade5b	\N	confidencial de B	2026-09-09 12:03:14.461536-05	pending
7403b0da-aea7-4200-96af-bfcc2f68c6a7	096b8dbd-1a92-4934-8bba-9f410c2dc16c	3963c7c0-d79c-4490-8c97-1eaa746ade5b	\N	Cinco años en infraestructura de despliegue continuo.	2026-09-09 12:05:36.736147-05	pending
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
ca52c066-e7eb-429e-bcb1-7aeb1a046127	e7266eab-d4a9-4d39-9b30-63d115f0ac88	763e641b-c59a-4d15-9311-4ba694bb591c	El manejo de ligaduras es impecable.	2026-09-09 11:38:06.074438-05
df11528f-cd8d-42b9-a760-1a77ec24e89f	b683f97f-b0de-4b05-ba0e-9e5d043bb06e	c575bb5e-4b46-490c-87bc-eeb69faecc78	El manejo de ligaduras es impecable.	2026-09-09 11:40:15.209678-05
a5fd8b68-1ca8-4b3c-82a6-40abdcd7af7f	1cd81ea9-aa7e-43dd-972d-0dda870457b8	8effcd5f-0b8d-4585-859b-22c331ebc705	El manejo de ligaduras es impecable.	2026-09-09 11:42:01.021596-05
f0e1abea-74de-47f0-9a6b-49b939058b04	957323f8-baa7-4ade-93df-f9b373296019	7169c560-2b7a-40f3-99c9-52217b459265	Comentario de B	2026-09-09 11:48:09.042079-05
10ebc54a-fb88-454c-8791-456fe82d76ea	957323f8-baa7-4ade-93df-f9b373296019	7169c560-2b7a-40f3-99c9-52217b459265	Otro de B	2026-09-09 11:48:09.050619-05
c5a7b392-3293-43af-b434-52daa3565b84	36d0e2f9-fb01-48b1-a5b1-a69b469db28c	e75bfa05-a4b0-4bd9-9a10-dbfd9bd90110	Comentario de B	2026-09-09 11:48:42.991921-05
0e139708-9a08-40b6-9f63-264f0a765b50	36d0e2f9-fb01-48b1-a5b1-a69b469db28c	e75bfa05-a4b0-4bd9-9a10-dbfd9bd90110	Otro de B	2026-09-09 11:48:42.996295-05
7b8ba80b-2384-4731-9b09-a97f548a70ba	89867b9a-eaae-402a-8f94-60f9c9c83874	4efb9584-189e-4ac7-8045-cadce3c6e57d	hola	2026-09-09 11:49:29.633513-05
704e2669-b59e-4656-b694-faa6cbf99338	096b8dbd-1a92-4934-8bba-9f410c2dc16c	954b52ac-2ae3-4715-920e-f4b515b42807	El manejo de ligaduras es impecable.	2026-09-09 12:05:18.784241-05
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
3940e486-79b6-495a-9aed-36b3b16299fe	b683f97f-b0de-4b05-ba0e-9e5d043bb06e	8edd2b76-d369-4076-be49-29050861a3ce	\N	2026-09-09 11:40:24.284139-05
fce4ce32-e97b-4cd6-92fc-6a1fdecc0e94	1cd81ea9-aa7e-43dd-972d-0dda870457b8	f8112e12-832f-4863-bcd2-95fd7eb31702	\N	2026-09-09 11:42:10.148318-05
e3314dbf-e110-41e8-8a90-90364c292595	89867b9a-eaae-402a-8f94-60f9c9c83874	3a86e493-60a0-4b0c-a3bf-3edf7a077ea3	\N	2026-09-09 11:49:29.646705-05
5ea4432f-fa4e-42a7-9600-bc7ede6e6d4d	096b8dbd-1a92-4934-8bba-9f410c2dc16c	d658cdcf-5c70-477d-8822-cd9b953a6336	\N	2026-09-09 12:05:27.937011-05
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
5e24cbeb-3f4e-4779-952a-5bf7a13edad3	100def8e-bee5-4c1f-8e93-727dd3254ff9	\N	Grace Hopper comentó tu proyecto «Motor tipográfico 1788971842395».	f	2026-09-09 11:38:06.081417-05
cdef7666-633c-4e46-a88d-dd1626a942b9	8edd2b76-d369-4076-be49-29050861a3ce	\N	Grace Hopper comentó tu proyecto «Motor tipográfico 1788971971592».	f	2026-09-09 11:40:15.211283-05
e5e80a01-604b-4a73-a0da-ac1c34aeedaa	8edd2b76-d369-4076-be49-29050861a3ce	\N	A Grace Hopper le gustó tu proyecto «Motor tipográfico 1788971971592».	f	2026-09-09 11:40:17.454509-05
8dc622cb-86e6-41f8-849a-55d4e9bc79dd	f8112e12-832f-4863-bcd2-95fd7eb31702	\N	Grace Hopper comentó tu proyecto «Motor tipográfico 1788972077643».	t	2026-09-09 11:42:01.023414-05
e078bd1b-f4fb-457c-b514-7e0be2545800	f8112e12-832f-4863-bcd2-95fd7eb31702	\N	A Grace Hopper le gustó tu proyecto «Motor tipográfico 1788972077643».	t	2026-09-09 11:42:03.269776-05
c4b88779-0b5c-4964-b057-7a6741722e5c	aa78b4e2-bac8-4a4c-85b1-64a2e39add7d	\N	Usuario B comentó tu proyecto «Proyecto de A».	f	2026-09-09 11:48:09.043213-05
a0c5b9d1-d982-4636-9fae-c84cced3f7b8	aa78b4e2-bac8-4a4c-85b1-64a2e39add7d	\N	Usuario B comentó tu proyecto «Proyecto de A».	t	2026-09-09 11:48:09.051079-05
f5797a12-1cce-496a-bac7-a9ad8957fbe7	328542d2-70d3-4d19-bc57-31c6cb5959b7	\N	Usuario B comentó tu proyecto «Proyecto de A».	f	2026-09-09 11:48:42.992609-05
8d90305d-2ba2-4136-95b3-8f2a05098f45	328542d2-70d3-4d19-bc57-31c6cb5959b7	\N	Usuario B comentó tu proyecto «Proyecto de A».	t	2026-09-09 11:48:42.996792-05
d7fa8138-dac6-44d7-a824-83c5b4e3840a	3a86e493-60a0-4b0c-a3bf-3edf7a077ea3	\N	A Borra B le gustó tu proyecto «Con like».	f	2026-09-09 11:49:29.61179-05
70aaa54e-241d-4b42-844e-b0ffda6e840d	3a86e493-60a0-4b0c-a3bf-3edf7a077ea3	\N	Borra B comentó tu proyecto «Con comentario».	f	2026-09-09 11:49:29.634788-05
5afa3c81-84b9-4e13-acd5-9c02ec9f4e5a	a2593a1c-e5b9-47e3-b4fc-02c1070afb1d	\N	Usuario B comentó tu proyecto «Proyecto de A».	f	2026-09-09 11:51:57.111977-05
0d54f78a-291e-4a92-bf7f-b17d3140bdcc	a2593a1c-e5b9-47e3-b4fc-02c1070afb1d	\N	Usuario B comentó tu proyecto «Proyecto de A».	t	2026-09-09 11:51:57.12133-05
e66afee1-38b7-4188-b6de-71bc751f371c	d83e64ec-6717-43c0-9c15-ffb5a3b16bd6	\N	Usuario B comentó tu proyecto «Proyecto de A».	f	2026-09-09 11:59:19.775552-05
83121d48-8df2-4214-9c8f-58c1254e1209	d83e64ec-6717-43c0-9c15-ffb5a3b16bd6	\N	Usuario B comentó tu proyecto «Proyecto de A».	t	2026-09-09 11:59:19.79321-05
85b7af5c-6f4d-4c8c-a75f-f0b04d8b6d53	d658cdcf-5c70-477d-8822-cd9b953a6336	\N	A Grace Hopper le gustó tu proyecto «Motor tipográfico 1788973475039».	t	2026-09-09 12:05:21.038741-05
76fcf474-d094-4c0f-98e9-a2e9b1940b1f	d658cdcf-5c70-477d-8822-cd9b953a6336	\N	Grace Hopper comentó tu proyecto «Motor tipográfico 1788973475039».	t	2026-09-09 12:05:18.786772-05
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Project" (project_id, user_id, title, description, publish_date, featured_image, demo_url, repository_url, status) FROM stdin;
763e641b-c59a-4d15-9311-4ba694bb591c	100def8e-bee5-4c1f-8e93-727dd3254ff9	Motor tipográfico 1788971842395	Guionado Knuth-Plass en Rust, compilado a WebAssembly.	2026-09-09 11:37:37.742256-05	/images/projects/763e641b-c59a-4d15-9311-4ba694bb591c.png	\N	\N	published
470212ac-1942-4f6c-bcf0-6fabcb90b4f3	100def8e-bee5-4c1f-8e93-727dd3254ff9	Atlas temporal 1788971842395	Base columnar en desarrollo.	2026-09-09 11:37:42.450189-05	\N	\N	\N	draft
c575bb5e-4b46-490c-87bc-eeb69faecc78	8edd2b76-d369-4076-be49-29050861a3ce	Motor tipográfico 1788971971592	Guionado Knuth-Plass en Rust, compilado a WebAssembly.	2026-09-09 11:39:46.895664-05	/images/projects/c575bb5e-4b46-490c-87bc-eeb69faecc78.png	\N	\N	published
a3586169-f3be-4ee0-82f1-a8ddedb8de87	8edd2b76-d369-4076-be49-29050861a3ce	Atlas temporal 1788971971592	Base columnar en desarrollo.	2026-09-09 11:39:51.591436-05	\N	\N	\N	draft
8effcd5f-0b8d-4585-859b-22c331ebc705	f8112e12-832f-4863-bcd2-95fd7eb31702	Motor tipográfico 1788972077643	Guionado Knuth-Plass en Rust, compilado a WebAssembly.	2026-09-09 11:41:32.718524-05	/images/projects/8effcd5f-0b8d-4585-859b-22c331ebc705.png	\N	\N	published
d760dfe1-4e5c-4d4d-8554-3b41a490bc1a	f8112e12-832f-4863-bcd2-95fd7eb31702	Atlas temporal 1788972077643	Base columnar en desarrollo.	2026-09-09 11:41:37.41512-05	\N	\N	\N	draft
2f58040c-b720-4de3-aa0a-53a4230f53ae	e8502b83-9ce6-4eaa-bfdc-dff94ea71880	Compilador de plantillas	Transforma plantillas declarativas en funciones puras de JavaScript, sin dependencias en tiempo de ejecución.	2026-09-09 11:43:30.593032-05	\N	https://demo.ejemplo.dev	https://github.com/ada/proyecto	published
96880cd0-2541-4b06-8dd4-9c19ea826676	beed05ce-701b-4040-984f-8f7992ec6225	Motor de composición tipográfica	Compone texto justificado con guionado Knuth-Plass. Escrito en Rust y compilado a WebAssembly; cabe en 40 KB.	2026-09-09 11:43:41.740754-05	/images/projects/96880cd0-2541-4b06-8dd4-9c19ea826676.png	https://demo.ejemplo.dev	https://github.com/ada/proyecto	published
d281735c-5d52-4529-bc34-de5297bad5dd	beed05ce-701b-4040-984f-8f7992ec6225	Atlas de series temporales	Base de datos columnar para métricas, con compresión delta-of-delta y consultas por debajo del milisegundo.	2026-09-09 11:43:46.166913-05	\N	https://demo.ejemplo.dev	https://github.com/ada/proyecto	published
7169c560-2b7a-40f3-99c9-52217b459265	aa78b4e2-bac8-4a4c-85b1-64a2e39add7d	Proyecto de A	Privado de A	2026-09-09 11:48:09.012304-05	\N	\N	\N	published
e75bfa05-a4b0-4bd9-9a10-dbfd9bd90110	328542d2-70d3-4d19-bc57-31c6cb5959b7	Proyecto de A	Privado de A	2026-09-09 11:48:42.980668-05	\N	\N	\N	published
10e14ad3-7139-45c4-9d69-532889334ad2	3a86e493-60a0-4b0c-a3bf-3edf7a077ea3	Con like	x	2026-09-09 11:49:29.566302-05	\N	\N	\N	published
4efb9584-189e-4ac7-8045-cadce3c6e57d	3a86e493-60a0-4b0c-a3bf-3edf7a077ea3	Con comentario	x	2026-09-09 11:49:29.628893-05	\N	\N	\N	published
2a2d9d76-02e7-4900-b82b-339a3d3b5fa4	3b4444ee-b910-4c27-b538-881fe7e4e172	Borrador privado	secreto	2026-09-09 11:53:07.861143-05	\N	\N	\N	draft
27b206d3-6f73-484d-99e4-e1fce6a60b2d	ca6031eb-8797-4787-93ef-be866ab211fc	Borrador privado	secreto	2026-09-09 11:54:22.330128-05	\N	\N	\N	draft
d52b694f-e476-4616-b3a9-03aaf5f3fa71	ca6031eb-8797-4787-93ef-be866ab211fc	Publicado	visible	2026-09-09 11:54:22.363963-05	\N	\N	\N	published
6d526fc8-14da-44de-b115-d91248d2bbe9	9fe88f59-79d4-4d7e-9d72-3c8b07199b59	<script>alert(1)</script><img src=x onerror=alert(2)>	<script>alert(1)</script><img src=x onerror=alert(2)>	2026-09-09 11:55:02.25134-05	/images/projects/6d526fc8-14da-44de-b115-d91248d2bbe9.gif	\N	\N	published
887fdb83-8bcc-460f-9905-c24a126f6ab4	aba01927-0469-4f2c-9fe9-83aa940c10e7	Borrador privado	secreto	2026-09-09 12:00:52.725982-05	\N	\N	\N	draft
bebd4c9b-39c1-4fcc-ac4f-ebd6489777d1	aba01927-0469-4f2c-9fe9-83aa940c10e7	Publicado	visible	2026-09-09 12:00:52.732404-05	\N	\N	\N	published
a2b8a655-1cbf-4e3c-8f25-b9765f1dbefd	66196297-fa80-4066-a6e2-5b0624deac83	<script>alert(1)</script><img src=x onerror=alert(2)>	<script>alert(1)</script><img src=x onerror=alert(2)>	2026-09-09 12:02:03.520529-05	/images/projects/a2b8a655-1cbf-4e3c-8f25-b9765f1dbefd.gif	\N	\N	published
adf1bbda-4284-4927-8c40-748c4b61fd39	fc2a0bba-ca07-4678-9fbb-0961d88aaef4	Borrador privado	secreto	2026-09-09 12:03:14.329836-05	\N	\N	\N	draft
954b52ac-2ae3-4715-920e-f4b515b42807	d658cdcf-5c70-477d-8822-cd9b953a6336	Motor tipográfico 1788973475039	Guionado Knuth-Plass en Rust, compilado a WebAssembly.	2026-09-09 12:04:50.258285-05	/images/projects/954b52ac-2ae3-4715-920e-f4b515b42807.png	\N	\N	published
78a0720f-92c5-4c57-aa59-17dc3cdc4b3a	d658cdcf-5c70-477d-8822-cd9b953a6336	Atlas temporal 1788973475039	Base columnar en desarrollo.	2026-09-09 12:04:54.967731-05	\N	\N	\N	draft
\.


--
-- Data for Name: Reaction; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Reaction" (reaction_id, user_id, project_id, type, reaction_date) FROM stdin;
f2173227-0371-450f-bc97-5620c6413b4f	b683f97f-b0de-4b05-ba0e-9e5d043bb06e	c575bb5e-4b46-490c-87bc-eeb69faecc78	like	2026-09-09 11:40:17.445433-05
0afaee96-e4fa-4c4f-9dd4-5fe400c028a4	1cd81ea9-aa7e-43dd-972d-0dda870457b8	8effcd5f-0b8d-4585-859b-22c331ebc705	like	2026-09-09 11:42:03.26633-05
27577cad-d45a-44d9-86e7-e1ec228f1c9b	89867b9a-eaae-402a-8f94-60f9c9c83874	10e14ad3-7139-45c4-9d69-532889334ad2	like	2026-09-09 11:49:29.576388-05
a672424c-629b-4a08-91e3-9834aec31411	096b8dbd-1a92-4934-8bba-9f410c2dc16c	954b52ac-2ae3-4715-920e-f4b515b42807	like	2026-09-09 12:05:21.03453-05
\.


--
-- Data for Name: RefreshToken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RefreshToken" (refresh_token_id, user_id, token_hash, expires_at, created_at, revoked_at) FROM stdin;
08025c07-0ec5-48f0-a837-aaed53eaa7e7	100def8e-bee5-4c1f-8e93-727dd3254ff9	7925B64F654F88608CFE5AA4163F834F6A39B1A93FF7410E351E7FDF8856361A	2026-09-16 11:37:33.020691-05	2026-09-09 11:37:33.020892-05	2026-09-09 11:37:52.375185-05
6e04ef87-c577-4539-999c-090c2a59cd09	e7266eab-d4a9-4d39-9b30-63d115f0ac88	5EE1B7AA22B69DD92B9937125D80B9BC8CC71A81DF20BE005A2B7BC2B16F74DA	2026-09-16 11:38:00.012107-05	2026-09-09 11:38:00.012111-05	\N
c9af0fed-8468-4d04-bfff-0be5a9dec106	8edd2b76-d369-4076-be49-29050861a3ce	12E93F2DB3D52F589EA8D7FB6DF172D52FF84286BBC20398CDD02456C52FAA3B	2026-09-16 11:39:42.154385-05	2026-09-09 11:39:42.154387-05	2026-09-09 11:40:01.511337-05
01434f01-97c9-4de5-845f-bc1a4a254a59	b683f97f-b0de-4b05-ba0e-9e5d043bb06e	305D4AB4C4AB37710DB6820732E033D0AB43A3C02BF17B362B057257430BC0E7	2026-09-16 11:40:09.155679-05	2026-09-09 11:40:09.15568-05	\N
dcdc3e80-1777-48bb-a721-489259d18907	a53d9ced-bbac-4f6c-97c9-a70c22867f58	41B3DC3CE6DF7A93DFB24BCB19D780E839B5180508C3E0CDF5AB236693676201	2026-09-16 11:41:16.572311-05	2026-09-09 11:41:16.572314-05	\N
3e58b2d8-54fe-4663-9ca3-fa1e054c0d29	f8112e12-832f-4863-bcd2-95fd7eb31702	80146168914C4C4AE7B2B5155654464BCA1F67EFCEF9F50A95BFB7744EF82BFA	2026-09-16 11:41:27.978096-05	2026-09-09 11:41:27.978109-05	2026-09-09 11:41:47.331733-05
5e49441a-67aa-46f4-be8d-0f7395fdfc17	1cd81ea9-aa7e-43dd-972d-0dda870457b8	B8F5DF6D2907C4452471C98DC5D35C0830B707428F08E30FB4A18F243D8F8C50	2026-09-16 11:41:54.95903-05	2026-09-09 11:41:54.959033-05	2026-09-09 11:42:29.448978-05
77decf35-a786-453d-9dcb-c1206154b27d	f8112e12-832f-4863-bcd2-95fd7eb31702	24EC53A9540FB857BEA8BF7D7F9C03B5B00F22CEE03CE5E9E8DAFAA56B6E1D76	2026-09-16 11:42:31.859908-05	2026-09-09 11:42:31.85991-05	2026-09-09 11:42:39.774578-05
aebf45cc-3aa3-4722-b601-caf3c2a8ea5c	f8112e12-832f-4863-bcd2-95fd7eb31702	81370F1A7D5868951E2973AC3A729E0EEF924A9515CB4B1C6B2201952C0AD256	2026-09-16 11:42:45.55792-05	2026-09-09 11:42:45.557926-05	2026-09-09 11:42:48.899746-05
847e2f52-b7d6-4236-b061-0879d83e5649	e8502b83-9ce6-4eaa-bfdc-dff94ea71880	70E12419D4EECFF223A7488A3891C045E70BEC7F387D6210F299C8BCCE8BD3B3	2026-09-16 11:43:26.395242-05	2026-09-09 11:43:26.39525-05	2026-09-09 11:43:34.046319-05
28298f03-10ba-4965-817b-8c7313ab2d31	beed05ce-701b-4040-984f-8f7992ec6225	DE793A8A67EC9D8B3BD312DA0F8C4EB09AFDA1C2992AB742C82A27D5810C96F9	2026-09-16 11:43:37.018594-05	2026-09-09 11:43:37.018596-05	\N
cc7e0c93-5222-4650-bd43-53ac019dd698	aa78b4e2-bac8-4a4c-85b1-64a2e39add7d	191F7411F44F59E999E9E9224D1F2B607A29B48278A2F77919AE356C033E2067	2026-09-16 11:48:08.794702-05	2026-09-09 11:48:08.794711-05	\N
91ca7adf-3156-4bc8-876f-ea0b22a49b3e	957323f8-baa7-4ade-93df-f9b373296019	9C7834EAC3E7E0827A3897C0F3F651B7F34710105F5475E3E3A49C01E34870C4	2026-09-16 11:48:08.90392-05	2026-09-09 11:48:08.903922-05	\N
99417710-f698-4373-bd84-ad0859e55d59	a53d9ced-bbac-4f6c-97c9-a70c22867f58	56BC07FE4DD7D63344A4CFB28B6C5DB9C6469391302E817CB62F40C99B244966	2026-09-16 11:48:09.008566-05	2026-09-09 11:48:09.008568-05	\N
3e9c30d4-6e3c-4c57-b874-8f5b9b50d028	f0fe77a3-d474-4046-98cb-3bd7dc04fbae	326F2BA7C2D6C2C58AAD00BEDC59E702BDD21AC0C2629A76E35AEB8BAF5DE5C4	2026-09-16 11:48:09.1566-05	2026-09-09 11:48:09.156601-05	\N
8a6c270a-fe2e-4c82-bcca-5bbd0c08ec67	73d826db-2ab5-46af-9533-3a4e4bf9058f	F5BAD1AC1298D7B53EF26D6B4F3C95A8FE64040B5751C7ADFCA6118B3C4BD57E	2026-09-16 11:48:27.080372-05	2026-09-09 11:48:27.080373-05	\N
cbda439e-2e4c-4107-ad13-825e4a676cc9	a53d9ced-bbac-4f6c-97c9-a70c22867f58	A3A51DFB9AAE70F4B61A329617C2EAF6C91122F8B9B0B3332F0203B029F86CD6	2026-09-16 11:48:27.188091-05	2026-09-09 11:48:27.188093-05	\N
88c5f41f-1da7-4f16-af75-2837825f5833	328542d2-70d3-4d19-bc57-31c6cb5959b7	FED659815E26EFF9D97B5ABECDBAC86EE8C9B0D5D737FC63831C6E6FD34D64F0	2026-09-16 11:48:42.76613-05	2026-09-09 11:48:42.766131-05	\N
c1d856f1-2471-4b66-ab9f-8fc2ce4a7a66	36d0e2f9-fb01-48b1-a5b1-a69b469db28c	EC1979D68A9AD5B55A4C05B84258CD7B62E4788A256F0B75C6268159798270F0	2026-09-16 11:48:42.873199-05	2026-09-09 11:48:42.8732-05	\N
08f80e26-84a5-4261-9c1f-8e9cdaebb6e5	a53d9ced-bbac-4f6c-97c9-a70c22867f58	475761E4BEA272FE5CD7A793556505C2B11DBA7F98133258603EB91D4548642B	2026-09-16 11:48:42.977543-05	2026-09-09 11:48:42.977544-05	\N
df538f0d-52a5-4a0c-8cd3-262d98a5fa05	ae5580d3-cbb7-40a0-9ed6-cb4c33c2488c	D8E3543EA3EC2593B9A16FB16D506E3A75B47A7E083B5BAA823C864A3BFC0673	2026-09-16 11:48:43.101245-05	2026-09-09 11:48:43.101247-05	\N
c47f1880-ca97-4108-9a56-9339cad318ed	3a86e493-60a0-4b0c-a3bf-3edf7a077ea3	343F68EF710DBD4F1CD031123E1D78551CC152CB98CAB08F7477E699E5B6CC52	2026-09-16 11:49:29.432143-05	2026-09-09 11:49:29.432154-05	\N
3a278673-1fd6-4556-a831-22b4c334399d	89867b9a-eaae-402a-8f94-60f9c9c83874	E4F5351B494D4DE3197AEEB25AD9BEF85B591138D317EE32E4C0CB82DD51F2A2	2026-09-16 11:49:29.562467-05	2026-09-09 11:49:29.562468-05	\N
697a8ff5-15d6-4b96-93a0-d72d203ad59d	e52ab2ed-c695-46e2-8d2d-f76f5f5425e8	4F521A436E43950D64B230330E6F33C0C075595130F72A6D93EE6C8A23EE5E66	2026-09-16 11:51:56.203943-05	2026-09-09 11:51:56.203944-05	\N
e63f47bd-265a-4a15-9079-ec6fe6b0fbc9	a2593a1c-e5b9-47e3-b4fc-02c1070afb1d	B766D569B0DAFA9C07FC00B86298A0392591D076F1E07442BB22C800E43001F6	2026-09-16 11:51:56.717038-05	2026-09-09 11:51:56.71704-05	\N
a0610a3a-2922-473c-904b-302c3407d1cc	6fba3bb1-15b6-49a1-928c-edb1db4f7f5c	7CD5C239C2DCF893F1B939DE7B3F0DFBEF843702B32EA15AD7AEE5238C56D109	2026-09-16 11:51:56.902971-05	2026-09-09 11:51:56.902973-05	\N
0bd6d391-7b80-42db-b06a-d7b616023155	a53d9ced-bbac-4f6c-97c9-a70c22867f58	409B1DD3CB938F1996A5947B199DE390463CBC339362420CF34B4548B78F36D4	2026-09-16 11:51:57.084751-05	2026-09-09 11:51:57.084752-05	\N
7e169c9c-e39a-452d-9fad-05f9a8e4d521	3a0f4558-9f99-450c-a8c6-2d20bf83600a	17985EC1AA40DD0751F20241A46625EB436DAFC6A704FD6FA22E72A9C4F81ADA	2026-09-16 11:51:57.299898-05	2026-09-09 11:51:57.299899-05	\N
3b7137b2-626f-4465-b3cb-c15567770fd1	66f2f941-b491-43fd-884c-d43e1698ff6a	7F2277C4AC621C433222C6C8FFA01CB1FF4F49A0F16B83F02306BD55270A290F	2026-09-16 11:52:12.00568-05	2026-09-09 11:52:12.005686-05	\N
baa1d781-8c14-41dc-b935-bf5362114931	a53d9ced-bbac-4f6c-97c9-a70c22867f58	DE84A5C54152D02EC9F6E60CC71D03CE04B52959DFE3CA2965CAA760415DED99	2026-09-16 11:52:12.112518-05	2026-09-09 11:52:12.112519-05	\N
9641b3b0-606c-47cf-99c4-385c5072519a	a53d9ced-bbac-4f6c-97c9-a70c22867f58	DBEF35A4EE7C2B292EA87D889BE14762445A033164D27EDF53E9CD6F1A013ECE	2026-09-16 11:53:07.40273-05	2026-09-09 11:53:07.402732-05	\N
b0d7845c-59de-4411-8edf-5cdcf885fbfe	381d19c5-952c-47ff-b526-7e1c0c50b444	872D26DDE4A2ED62071C535D0F2535BFFC07FAADFAC14CACCC832831192A07D7	2026-09-16 11:53:07.514078-05	2026-09-09 11:53:07.514079-05	\N
29c370cc-5532-4ef7-bbaf-77fa48d0d2be	381d19c5-952c-47ff-b526-7e1c0c50b444	AB7DF4ADF2896B7EB83EEEE76941AACEFE0E64168316562371B460AD9BFD685D	2026-09-16 11:53:07.635407-05	2026-09-09 11:53:07.635409-05	\N
49503f57-477b-48ca-a0b5-9e8d6872d511	381d19c5-952c-47ff-b526-7e1c0c50b444	A29E6173542DD18FBA45A39B2D5456C860D5C32D2C910345C50095667848A8AD	2026-09-16 11:53:07.740975-05	2026-09-09 11:53:07.740976-05	\N
f1d21b61-f9fd-46cc-aa9c-7ba889c02e79	3b4444ee-b910-4c27-b538-881fe7e4e172	84ED046E35833F1B9638FAE1BB11BDBDD726229B69D8C736251630412E085D05	2026-09-16 11:53:07.858626-05	2026-09-09 11:53:07.858627-05	\N
6dc24b0b-e597-4009-a340-75fe6ba640d4	dc29ca0b-fb29-4b59-b91d-9d5ee36ea0e0	5053472592E283CFAB22C4672B26CB74F05ADAD46E1850F6B26AE963EBAD214E	2026-09-16 11:53:07.986091-05	2026-09-09 11:53:07.986093-05	\N
3e109505-5a64-4e86-854e-7b133798b88f	ca6031eb-8797-4787-93ef-be866ab211fc	D8E0984272297D1DC5E8DDA3ED9370A02FA5217CCFCC2560644D03B0D2F08BFF	2026-09-16 11:54:22.101823-05	2026-09-09 11:54:22.102033-05	\N
a86fb808-47d2-47f1-8f3f-97ca747f67d8	da6b8707-ce04-429a-8b1a-8332c12bad1e	9E68DD4A08DEDACDD35ACE77B81FEA132433DEA0950B1F9B56400B43A1AE694B	2026-09-16 11:54:22.3087-05	2026-09-09 11:54:22.308701-05	\N
c85b810d-bd7d-49eb-a53e-dea0c27a939e	9fe88f59-79d4-4d7e-9d72-3c8b07199b59	5F03E74823D30E8696C808BDE05C97E0BC4C9C57973BEA8A6C7FC35CBE5917CC	2026-09-16 11:55:02.166922-05	2026-09-09 11:55:02.166924-05	\N
9f88417f-f826-4769-a050-ff260e28ebff	2c31253f-5aaa-4ad8-83ac-b21af8091f9b	B459E93B05FCFED629CC48C00526217D9E5943BB720F2B2140188663EB2734BB	2026-09-16 11:56:10.733385-05	2026-09-09 11:56:10.733386-05	\N
67baa636-598e-40f7-9029-170a1e67eb13	d1b1e2e4-7bcb-43cf-b3ae-6f076d478124	2FD527E1FB43D26D9404689725C3A4F1CAAC5037A0B932DBD988812293F47399	2026-09-16 11:56:10.542937-05	2026-09-09 11:56:10.543145-05	2026-09-09 11:56:10.751211-05
f2f8c6c6-1a9d-4549-b143-58c30f57027f	d1b1e2e4-7bcb-43cf-b3ae-6f076d478124	CAA3EEF8021B9A70B870D571F5860ADC5C152B83F34AD33033EEB55311005032	2026-09-16 11:56:10.755561-05	2026-09-09 11:56:10.755561-05	2026-09-09 11:56:10.76445-05
90d3bfff-f6b1-4c9b-9ab6-b173cb147703	ebabd7c3-3257-4e59-9ec4-2cd7b427dda6	616BA39460159F759559461750BDBDD25A1A84F9C9FE445A4849F9A714A98764	2026-09-16 11:56:10.945529-05	2026-09-09 11:56:10.94553-05	2026-09-09 11:56:11.316585-05
518e4281-e1b8-49e7-b35c-a6f56a3ed185	d83e64ec-6717-43c0-9c15-ffb5a3b16bd6	B7F3BE0BDADD9D5771D3A579E969879A344ECFF76E48982CD3BABABBDACA6A29	2026-09-16 11:59:19.341517-05	2026-09-09 11:59:19.34171-05	\N
19ed55ba-de7f-492d-bff3-36396646036c	483c4e26-6b88-4b22-a9c0-c886a0692ac5	9A44E693EB7C6382102B70C336A117375744AAA9973AD5330AB237F5B0AA9809	2026-09-16 11:59:19.530431-05	2026-09-09 11:59:19.530433-05	\N
a0e2db00-77b7-45b2-800c-6d1bd4a57850	a53d9ced-bbac-4f6c-97c9-a70c22867f58	B762B50AF1575509B4CE6F63F09E07388EA563341E5EA25808E68F77B1B19D7B	2026-09-16 11:59:19.710237-05	2026-09-09 11:59:19.710238-05	\N
23b0e695-8008-492e-900d-e5a87eb7abc9	c9504e48-ec0d-4552-88b5-6926bcb9f597	AEA01539961A111AF807C746FA35899DC80139FB943C46AABCD0BAB5EF176929	2026-09-16 11:59:19.971363-05	2026-09-09 11:59:19.971364-05	\N
5fe81cfa-cfa6-4089-9882-88244dd9ee7c	a44ff99d-fef3-4a77-b646-09bdee5854e1	F74057A0B9F40DECFC9CA1C7A591AD928E16460D4B3FD7D78A9E430FAD4EA64B	2026-09-16 11:59:23.257617-05	2026-09-09 11:59:23.25762-05	\N
49cdf0ec-7420-4768-8ea6-c6ab5bb9d225	a53d9ced-bbac-4f6c-97c9-a70c22867f58	B6119236D9CBF0A4DA1C4B29CD7B1E9D33925BEFACFF9F7B84007AEEA6E8AD41	2026-09-16 11:59:23.424439-05	2026-09-09 11:59:23.42444-05	\N
fe96958e-d87e-4f69-852b-017f355ae8ff	a53d9ced-bbac-4f6c-97c9-a70c22867f58	816E423C4F961125FDF2EC64F8993EED1E64CEE51BF97461715E39914A60EADC	2026-09-16 11:59:26.704666-05	2026-09-09 11:59:26.704667-05	\N
946c1384-f73d-4491-815e-54e4a9a64d6f	bf4aab25-2abc-4970-b9ca-3f5007672e5a	8C740FB68A5CC889615576F651F58F04410956C74D9A6929F05C0A16A1927C1B	2026-09-16 11:59:26.815251-05	2026-09-09 11:59:26.815252-05	\N
1707ee45-2708-47da-b802-02ae2484361f	bf4aab25-2abc-4970-b9ca-3f5007672e5a	8FE9B6DABB214306CF2F220F5FE6ED4EE8A908C0C478D28E04CA7126DD025A14	2026-09-16 11:59:26.940882-05	2026-09-09 11:59:26.940883-05	\N
d76a80d2-9de9-47e1-8479-63e1b857f90c	bf4aab25-2abc-4970-b9ca-3f5007672e5a	261E6565DF4E56851FA557E25F702AA48F2FBDFEEB790C392667B020191B69D8	2026-09-16 11:59:27.046494-05	2026-09-09 11:59:27.046495-05	\N
df592dd7-75f7-4a58-b281-1a1baf373163	aba01927-0469-4f2c-9fe9-83aa940c10e7	267D10F1BE4FF86201124EFC97B02A7F3AE9938F7510BF361733610724209AFC	2026-09-16 12:00:52.612181-05	2026-09-09 12:00:52.612183-05	\N
7ee3681d-dd54-4315-bc44-84eedd15381f	431bda60-27f2-435a-9638-97757138994c	DF84A37AB78E963643CBEC6D5D18AB3BA928858229E0C11BA5CE1A2013EE30EF	2026-09-16 12:00:52.721976-05	2026-09-09 12:00:52.721977-05	\N
35448895-ae4b-443a-98f5-c7e4ba13274e	66196297-fa80-4066-a6e2-5b0624deac83	9EB2F96B735103A5D761B5919F6C086EEF33D8C413F4B9606DEAFE1FAA6F5A6B	2026-09-16 12:02:03.491431-05	2026-09-09 12:02:03.491433-05	\N
25ee3d51-b714-497f-a394-84a3cd64cf91	a53d9ced-bbac-4f6c-97c9-a70c22867f58	EB9549C7E2189D53F1AF8DD0C66E527C16477F3B0985DBBB7C0702DE4BE17368	2026-09-16 12:03:13.871691-05	2026-09-09 12:03:13.871697-05	\N
612dd177-d079-4d2a-8daa-8bc3cddc5b6a	cdfca991-643c-437d-a7c5-cc4511e75996	55D27CB5E81E9B4B44EC6A4B26B64FAFC22CD39C92C5A8F86CBCB3C7CFDD66C9	2026-09-16 12:03:13.984227-05	2026-09-09 12:03:13.984229-05	\N
a60ba65c-2067-48f0-a2f5-857b94514464	cdfca991-643c-437d-a7c5-cc4511e75996	0E267451451D72AF3888BC30050BDC137A7B336F6A99DA6B159B16499ED0DE9B	2026-09-16 12:03:14.103581-05	2026-09-09 12:03:14.103582-05	\N
fe92a3c7-2266-4e93-adda-8c9262f90d32	cdfca991-643c-437d-a7c5-cc4511e75996	2FF66EF426880726A092662467730C573F58617BC57189DD3B9D44F7980D79AC	2026-09-16 12:03:14.209694-05	2026-09-09 12:03:14.209696-05	\N
f048db78-a2d6-43c4-bbcc-53c465cbf2c6	fc2a0bba-ca07-4678-9fbb-0961d88aaef4	49E9CCDA714A9E1B10CDFD615DCAFEFDF087A9D9DCB9D2AA1C4A52ED5501E83A	2026-09-16 12:03:14.327088-05	2026-09-09 12:03:14.327089-05	\N
a1599022-326a-436d-9728-a57456da2c47	ca8881e8-e657-496c-9120-b96c7402c112	0A64B5B9E48B12A98A3E9199AFDCF3CFC5FBE08BD7EB097CE19E07C218B8D290	2026-09-16 12:03:14.449008-05	2026-09-09 12:03:14.44901-05	\N
931d76da-078b-454c-bc61-5421f7f4b042	d658cdcf-5c70-477d-8822-cd9b953a6336	5E1533CF4F6E8C4A2FF3350EB5D75B7B96E854D952108C31F1B7321C0F0E3DC5	2026-09-16 12:04:45.479818-05	2026-09-09 12:04:45.479822-05	2026-09-09 12:05:04.970632-05
53cf7711-27cf-4f17-aaa2-a8691b35fdb2	096b8dbd-1a92-4934-8bba-9f410c2dc16c	A8E6304425A8F237CB725994FA91D6D42D49BC4F59749EAF30B43ED5B93D6264	2026-09-16 12:05:12.679968-05	2026-09-09 12:05:12.67997-05	2026-09-09 12:05:47.32405-05
bbba8074-6ffc-4c91-8604-d17a8a35eebe	d658cdcf-5c70-477d-8822-cd9b953a6336	B744F689404A161A3A16B88F8127544C6A0C222976F2DE3750472A36AEAA6A48	2026-09-16 12:05:49.812932-05	2026-09-09 12:05:49.812934-05	2026-09-09 12:05:57.712447-05
24613779-7e3b-4681-9e61-25fbdc9183e2	d658cdcf-5c70-477d-8822-cd9b953a6336	6CB8CA7FEA9073C219FB7249F74E64DBF07B9A82FFE114423390796E66DCBFF0	2026-09-16 12:06:03.49054-05	2026-09-09 12:06:03.490541-05	2026-09-09 12:06:06.854831-05
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
381d19c5-952c-47ff-b526-7e1c0c50b444	0af91311-34cf-4511-9671-3944fe4a62f8	Escalador	esc1788972787279@t.dev	$2a$11$uqJgOZK5mrPs7Odhn7Yz5OISueacH9NPEl4SQ/euqmzl3pGErrxbK	x	y	2026-09-09 11:53:07.512118-05	\N
100def8e-bee5-4c1f-8e93-727dd3254ff9	0af91311-34cf-4511-9671-3944fe4a62f8	Ada Lovelace Byron	ada1788971842395@test.dev	$2a$11$aLZNZjm3p4ycrdtjvy1o8OXMfZWRLAPiAp9dTzq9Jomg6DXBojV4G	Compiladores y tipografía digital.	Medellín, Colombia	2026-09-09 11:37:33.006042-05	/images/avatars/100def8e-bee5-4c1f-8e93-727dd3254ff9_1788971868.png
e7266eab-d4a9-4d39-9b30-63d115f0ac88	0af91311-34cf-4511-9671-3944fe4a62f8	Grace Hopper	grace1788971842395@test.dev	$2a$11$EQvMGslr4haZ/35aeAZTAe.xlCJpItPZkenOdt1JmV5TUZYwO1i92	Lenguajes.	Cali	2026-09-09 11:38:00.010034-05	\N
3b4444ee-b910-4c27-b538-881fe7e4e172	0af91311-34cf-4511-9671-3944fe4a62f8	Autor	au1788972787279@t.dev	$2a$11$Lr3CEC7YyuGh7ZnINz3/5e6inrKu5qoXDhiKPW896tz0cECB4CS9e	\N	\N	2026-09-09 11:53:07.856726-05	\N
8edd2b76-d369-4076-be49-29050861a3ce	0af91311-34cf-4511-9671-3944fe4a62f8	Ada Lovelace Byron	ada1788971971592@test.dev	$2a$11$3uLU9wEx2D/O2ew4Gzom/ewp4NI872LFfWLTaOBgMKbfPOPafbvLq	Compiladores y tipografía digital.	Medellín, Colombia	2026-09-09 11:39:42.151751-05	/images/avatars/8edd2b76-d369-4076-be49-29050861a3ce_1788971997.png
b683f97f-b0de-4b05-ba0e-9e5d043bb06e	0af91311-34cf-4511-9671-3944fe4a62f8	Grace Hopper	grace1788971971592@test.dev	$2a$11$G8GvhDSFU/wNl2V/cS8uTe3XTYPTFeRPVIU2Jn3GvmO3Oysu1k/I6	Lenguajes.	Cali	2026-09-09 11:40:09.153873-05	\N
dc29ca0b-fb29-4b59-b91d-9d5ee36ea0e0	0af91311-34cf-4511-9671-3944fe4a62f8	Postulante	po1788972787279@t.dev	$2a$11$h5v5zke8vPx2UrrO68XsOethCE7AqwjXOWu5F26P/UkFsZyiMS.I.	\N	\N	2026-09-09 11:53:07.984698-05	\N
ca6031eb-8797-4787-93ef-be866ab211fc	0af91311-34cf-4511-9671-3944fe4a62f8	Dueño	dn1788972861784@t.dev	$2a$11$CqR7qK9lCNt40aUQeISNl.Bw7YGSfSOXwsWmAXtVj94TY5AtZmCOi	\N	\N	2026-09-09 11:54:22.054912-05	\N
1cd81ea9-aa7e-43dd-972d-0dda870457b8	0af91311-34cf-4511-9671-3944fe4a62f8	Grace Hopper	grace1788972077643@test.dev	$2a$11$Xut1nJ3QeXxmYRyQIY8.DuvhOYeNkhAlfCFCrWoGkRcnk1p6NU6Qy	Lenguajes.	Cali	2026-09-09 11:41:54.955589-05	\N
f8112e12-832f-4863-bcd2-95fd7eb31702	0af91311-34cf-4511-9671-3944fe4a62f8	Ada Lovelace Byron	ada1788972077643@test.dev	$2a$11$cAE4BduC50C8sdnk5PgZDOa/MDMAr43g3JQx0DxJkgBuvUG1O0xyy	Compiladores y tipografía digital.	Medellín, Colombia	2026-09-09 11:41:27.974514-05	/images/avatars/f8112e12-832f-4863-bcd2-95fd7eb31702_1788972103.png
e8502b83-9ce6-4eaa-bfdc-dff94ea71880	0af91311-34cf-4511-9671-3944fe4a62f8	Grace Hopper	grace@demo.test	$2a$11$CaSpAI1rCkXy53tqXB6Ege1/akmCFCKVsX6Y/aqdTyWT8lNPqDDAy	Lenguajes y herramientas de desarrollo.	Cali, Colombia	2026-09-09 11:43:26.39109-05	\N
da6b8707-ce04-429a-8b1a-8332c12bad1e	0af91311-34cf-4511-9671-3944fe4a62f8	Ajeno	aj1788972861784@t.dev	$2a$11$XdKEkU7Pt4kfg7tvFhRNqOpKf5IE8tImchB9HrLsbo.8N7udq7.V6	\N	\N	2026-09-09 11:54:22.306687-05	\N
beed05ce-701b-4040-984f-8f7992ec6225	0af91311-34cf-4511-9671-3944fe4a62f8	Ada Lovelace	ada@demo.test	$2a$11$2fJuse4rwhbLXjdxLyGU0e/H50Ca31evPgxMHkLLkr0RJyrZ02ddG	Ingeniera de sistemas. Escribo compiladores y herramientas de composición tipográfica.	Bogotá, Colombia	2026-09-09 11:43:37.01655-05	/images/avatars/beed05ce-701b-4040-984f-8f7992ec6225_1788972231.png
aa78b4e2-bac8-4a4c-85b1-64a2e39add7d	0af91311-34cf-4511-9671-3944fe4a62f8	Usuario A	sa1788972488650@t.dev	$2a$11$WCwc/rLKJeKkyc92t2e8EuRlJpdb4Uagi6qN/YC7YG.YIsFgkPkCe	\N	\N	2026-09-09 11:48:08.789825-05	\N
957323f8-baa7-4ade-93df-f9b373296019	0af91311-34cf-4511-9671-3944fe4a62f8	Usuario B	sb1788972488650@t.dev	$2a$11$RvA/bIIo/nAhW2uH8mc.G.n3TATjeNBD/XqdYToij39zjmNIUmtxu	\N	\N	2026-09-09 11:48:08.902357-05	\N
f0fe77a3-d474-4046-98cb-3bd7dc04fbae	0af91311-34cf-4511-9671-3944fe4a62f8	Usuario C	sc1788972488650@t.dev	$2a$11$2K2Yy3CNq1NO0a3GRw6wtepXfmo/BKecNvfCOhS8JHJKQzBfE8XJ6	\N	\N	2026-09-09 11:48:09.154826-05	\N
73d826db-2ab5-46af-9533-3a4e4bf9058f	0af91311-34cf-4511-9671-3944fe4a62f8	Dbg A	dbga1788972506953@t.dev	$2a$11$7BTboqr/7jNbJwNUoLf8auQEEAOURB/pchvqfexIS9TieOENrPuz2	\N	\N	2026-09-09 11:48:27.078462-05	\N
328542d2-70d3-4d19-bc57-31c6cb5959b7	0af91311-34cf-4511-9671-3944fe4a62f8	Usuario A	sa1788972522641@t.dev	$2a$11$SzxRSigbNA9VstFa8WVKA.Ti3HNSox5KkQEuoO1sNCcFsU3LQJRJO	\N	\N	2026-09-09 11:48:42.764655-05	\N
36d0e2f9-fb01-48b1-a5b1-a69b469db28c	0af91311-34cf-4511-9671-3944fe4a62f8	Usuario B	sb1788972522641@t.dev	$2a$11$8bLDBeOj4JOFx8.v1QakCe8qlj2pxM3.990/hkStiweVayxZnmFwO	\N	\N	2026-09-09 11:48:42.871615-05	\N
ae5580d3-cbb7-40a0-9ed6-cb4c33c2488c	0af91311-34cf-4511-9671-3944fe4a62f8	Usuario C	sc1788972522641@t.dev	$2a$11$pFaDeIIKPRlt0am9pmg13.6f.1Aj1wH1Vzqa/wxYhh3F5oJz9JO6O	\N	\N	2026-09-09 11:48:43.099941-05	\N
3a86e493-60a0-4b0c-a3bf-3edf7a077ea3	0af91311-34cf-4511-9671-3944fe4a62f8	Borra A	da1788972569237@t.dev	$2a$11$OlNaplV1AlLFwRDxQrcyeegzHXj4YEyaSdY..35FXU08Kea/eUgie	\N	\N	2026-09-09 11:49:29.428908-05	\N
89867b9a-eaae-402a-8f94-60f9c9c83874	0af91311-34cf-4511-9671-3944fe4a62f8	Borra B	db1788972569237@t.dev	$2a$11$GIPpXZ1lwrCX0P4U7CBz/uO22qEoQei3wZZc8/BrWC.zlxxdYW4Ba	\N	\N	2026-09-09 11:49:29.561248-05	\N
e52ab2ed-c695-46e2-8d2d-f76f5f5425e8	0af91311-34cf-4511-9671-3944fe4a62f8	Borra B	db1788972715728@t.dev	$2a$11$sGtRQibqwNA55PhP7r0qxejFk6c/2cYHdhZgBmpcZDRreDZpbSJZW	\N	\N	2026-09-09 11:51:56.202101-05	\N
a2593a1c-e5b9-47e3-b4fc-02c1070afb1d	0af91311-34cf-4511-9671-3944fe4a62f8	Usuario A	sa1788972716517@t.dev	$2a$11$X2Etylmr014TS6cJPkEVAOra1fD54bw6sIZMR311eROHIeCwTIvKG	\N	\N	2026-09-09 11:51:56.715001-05	\N
6fba3bb1-15b6-49a1-928c-edb1db4f7f5c	0af91311-34cf-4511-9671-3944fe4a62f8	Usuario B	sb1788972716517@t.dev	$2a$11$iXN6w0jNrHYzXEyfYJ0IJON7FcL4.7wh1DzQgjTa6Lo/svZkIROkO	\N	\N	2026-09-09 11:51:56.900658-05	\N
3a0f4558-9f99-450c-a8c6-2d20bf83600a	0af91311-34cf-4511-9671-3944fe4a62f8	Usuario C	sc1788972716517@t.dev	$2a$11$QZBTf2dPMD91.hh89EZRPu5lOtXth606HSgLzPYlko2vS8mXjAbJa	\N	\N	2026-09-09 11:51:57.297822-05	\N
66f2f941-b491-43fd-884c-d43e1698ff6a	0af91311-34cf-4511-9671-3944fe4a62f8	Normal	un1788972731880@t.dev	$2a$11$DlA3g.MgdL265esHktA6Z.vsRlV/ofDgH6auHndFsTkYYgsB.mJl2	\N	\N	2026-09-09 11:52:12.003513-05	\N
9fe88f59-79d4-4d7e-9d72-3c8b07199b59	0af91311-34cf-4511-9671-3944fe4a62f8	<script>alert(1)</script><img src=x onerror=alert(2)>	pt1788972901968@t.dev	$2a$11$xj1.cayN9tvGr1P.Ubo.FOOcR9s6mRT4r7NE6Cpt9mfFLnkFB7mnW	<script>alert(1)</script><img src=x onerror=alert(2)>	<script>alert(1)</script><img src=x onerror=alert(2)>	2026-09-09 11:55:02.164887-05	\N
d1b1e2e4-7bcb-43cf-b3ae-6f076d478124	0af91311-34cf-4511-9671-3944fe4a62f8	Sesiones	se1788972970230@t.dev	$2a$11$rze2XdEaoSfjyQmMBDhJyuOyzyP/MZ0dEd6PZCDvt5Ipy1CkyZpX6	\N	\N	2026-09-09 11:56:10.498443-05	\N
2c31253f-5aaa-4ad8-83ac-b21af8091f9b	0af91311-34cf-4511-9671-3944fe4a62f8	Otro	ot1788972970230@t.dev	$2a$11$6WcXCDmte3R3zBfQsZKVYOjdErbCSf/tcVrVwOuvOlCg4qp/W2saK	\N	\N	2026-09-09 11:56:10.73172-05	\N
ebabd7c3-3257-4e59-9ec4-2cd7b427dda6	0af91311-34cf-4511-9671-3944fe4a62f8	Revoca	rv1788972970230@t.dev	$2a$11$mn4RR.8OGxX56lpedUJn6.stR1I7iHekFGnA9S1/HFnR3LG22Y4Qy	\N	\N	2026-09-09 11:56:10.943498-05	\N
d83e64ec-6717-43c0-9c15-ffb5a3b16bd6	0af91311-34cf-4511-9671-3944fe4a62f8	Usuario A	sa1788973159082@t.dev	$2a$11$4j9ZOu26ZuE2U9JmD/kmMOy9rPrs/A57rHIIVMd765nr5wex7d4P.	\N	\N	2026-09-09 11:59:19.297342-05	\N
483c4e26-6b88-4b22-a9c0-c886a0692ac5	0af91311-34cf-4511-9671-3944fe4a62f8	Usuario B	sb1788973159082@t.dev	$2a$11$DeZ4zTEaOHQz6XEFjwi1/eg.bWem9/dFds1yj1/xcvoZnFU9.cBU6	\N	\N	2026-09-09 11:59:19.528635-05	\N
c9504e48-ec0d-4552-88b5-6926bcb9f597	0af91311-34cf-4511-9671-3944fe4a62f8	Usuario C	sc1788973159082@t.dev	$2a$11$9BZ4/8pD557kF0AMnW2Y7uzYvrzgu7hTHjOMLjdjxRw7uPAg/j1U.	\N	\N	2026-09-09 11:59:19.970078-05	\N
a44ff99d-fef3-4a77-b646-09bdee5854e1	0af91311-34cf-4511-9671-3944fe4a62f8	Normal	un1788973163057@t.dev	$2a$11$jZ1OyHuAFaWz257m9.wqFelnkTZYmBdREZdw9Wm1W6gCqaxbqSoK2	\N	\N	2026-09-09 11:59:23.255724-05	\N
bf4aab25-2abc-4970-b9ca-3f5007672e5a	0af91311-34cf-4511-9671-3944fe4a62f8	Escalador	esc1788973166576@t.dev	$2a$11$BCgOlx4OMT.5ZBCpTF91gucedGCvWtZc4Z8hbOl4/MQGM5Oeg/5JG	x	y	2026-09-09 11:59:26.813206-05	\N
aba01927-0469-4f2c-9fe9-83aa940c10e7	0af91311-34cf-4511-9671-3944fe4a62f8	Dueño	dn1788973252472@t.dev	$2a$11$IhJajmRrq.hFdGYSwhZ.lOsTQH7CFEVd7nU.i9HCF05BIpNdyJ0/i	\N	\N	2026-09-09 12:00:52.609017-05	\N
431bda60-27f2-435a-9638-97757138994c	0af91311-34cf-4511-9671-3944fe4a62f8	Ajeno	aj1788973252472@t.dev	$2a$11$YjrhioATLFFXFYRUcrCowenDyC7eXuedSIy2qHETF0RgU73boq8CK	\N	\N	2026-09-09 12:00:52.720368-05	\N
66196297-fa80-4066-a6e2-5b0624deac83	0af91311-34cf-4511-9671-3944fe4a62f8	<script>alert(1)</script><img src=x onerror=alert(2)>	pt1788973323312@t.dev	$2a$11$ET77yBLVCTMDekgKjiyH1OrFUxEd6NA3bLK1mo5TWB4JfnhyD9UO2	<script>alert(1)</script><img src=x onerror=alert(2)>	<script>alert(1)</script><img src=x onerror=alert(2)>	2026-09-09 12:02:03.48849-05	\N
cdfca991-643c-437d-a7c5-cc4511e75996	0af91311-34cf-4511-9671-3944fe4a62f8	Escalador	esc1788973393740@t.dev	$2a$11$x3VDHBcX1iQ3eHWTfAmjp.oba.mh2qVU0FIpfrLa7.Zz7HFsJGuCK	x	y	2026-09-09 12:03:13.982316-05	\N
fc2a0bba-ca07-4678-9fbb-0961d88aaef4	0af91311-34cf-4511-9671-3944fe4a62f8	Autor	au1788973393740@t.dev	$2a$11$xZ2IagSBFOpiqCikkAePK.B7.NQQAeZwP4k3ejK3PzQSCHLgNAD76	\N	\N	2026-09-09 12:03:14.325726-05	\N
ca8881e8-e657-496c-9120-b96c7402c112	0af91311-34cf-4511-9671-3944fe4a62f8	Postulante	po1788973393740@t.dev	$2a$11$1FlZ69i/8lhoYwNKgvFLUuhMPqYK5cPrNNcSFIyfC94pas6LuynN6	\N	\N	2026-09-09 12:03:14.447872-05	\N
096b8dbd-1a92-4934-8bba-9f410c2dc16c	0af91311-34cf-4511-9671-3944fe4a62f8	Grace Hopper	grace1788973475039@test.dev	$2a$11$PWZBZuD4w/UYynSs5Xee/OWD3MZIcn4E4EcXSyyKS.N/vV4k.34Fq	Lenguajes.	Cali	2026-09-09 12:05:12.677767-05	\N
d658cdcf-5c70-477d-8822-cd9b953a6336	0af91311-34cf-4511-9671-3944fe4a62f8	Ada Lovelace Byron	ada1788973475039@test.dev	$2a$11$do0CWL5faRUE4IXUacobNegJVVZd69lMYSojP.LySOEvI8.a9T1Ca	Compiladores y tipografía digital.	Medellín, Colombia	2026-09-09 12:04:45.476049-05	/images/avatars/d658cdcf-5c70-477d-8822-cd9b953a6336_1788973500.png
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

\unrestrict atOFSITU8GxFKihnalhcQWj0w6ujMof9dAqUSFX8c3arHfhQ7iZXFyWIPIqXWnC

