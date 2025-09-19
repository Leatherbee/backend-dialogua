--
-- PostgreSQL database dump
--

-- Dumped from database version 17.6 (Postgres.app)
-- Dumped by pg_dump version 17.5

-- Started on 2025-09-19 16:06:09 WIB

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4020 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 952 (class 1247 OID 18452)
-- Name: content_items_content_type_enum; Type: TYPE; Schema: public; Owner: prammmoe
--

CREATE TYPE public.content_items_content_type_enum AS ENUM (
    'quiz',
    'roleplay'
);


ALTER TYPE public.content_items_content_type_enum OWNER TO prammmoe;

--
-- TOC entry 901 (class 1247 OID 16754)
-- Name: level_type_enum; Type: TYPE; Schema: public; Owner: prammmoe
--

CREATE TYPE public.level_type_enum AS ENUM (
    'Quiz',
    'Roleplay AI'
);


ALTER TYPE public.level_type_enum OWNER TO prammmoe;

--
-- TOC entry 907 (class 1247 OID 18130)
-- Name: media_assets_media_type_enum; Type: TYPE; Schema: public; Owner: prammmoe
--

CREATE TYPE public.media_assets_media_type_enum AS ENUM (
    'image',
    'video',
    'audio',
    'document'
);


ALTER TYPE public.media_assets_media_type_enum OWNER TO prammmoe;

--
-- TOC entry 904 (class 1247 OID 18120)
-- Name: media_type_enum; Type: TYPE; Schema: public; Owner: prammmoe
--

CREATE TYPE public.media_type_enum AS ENUM (
    'image',
    'video',
    'audio',
    'document'
);


ALTER TYPE public.media_type_enum OWNER TO prammmoe;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 18158)
-- Name: content_items; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.content_items (
    id integer NOT NULL,
    content_type public.content_items_content_type_enum NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    content text,
    "position" integer NOT NULL,
    unit_level_id integer NOT NULL,
    media_asset_id integer,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.content_items OWNER TO prammmoe;

--
-- TOC entry 227 (class 1259 OID 18157)
-- Name: content_items_id_seq; Type: SEQUENCE; Schema: public; Owner: prammmoe
--

CREATE SEQUENCE public.content_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.content_items_id_seq OWNER TO prammmoe;

--
-- TOC entry 4021 (class 0 OID 0)
-- Dependencies: 227
-- Name: content_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prammmoe
--

ALTER SEQUENCE public.content_items_id_seq OWNED BY public.content_items.id;


--
-- TOC entry 231 (class 1259 OID 18216)
-- Name: form_fields; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.form_fields (
    id integer NOT NULL,
    field_name character varying(255) NOT NULL,
    placeholder character varying(255),
    is_required boolean DEFAULT false NOT NULL,
    validation_rules jsonb DEFAULT '{}'::jsonb NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    field_type character varying(50) NOT NULL,
    form_question_id integer NOT NULL
);


ALTER TABLE public.form_fields OWNER TO prammmoe;

--
-- TOC entry 230 (class 1259 OID 18215)
-- Name: form_fields_id_seq; Type: SEQUENCE; Schema: public; Owner: prammmoe
--

CREATE SEQUENCE public.form_fields_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.form_fields_id_seq OWNER TO prammmoe;

--
-- TOC entry 4022 (class 0 OID 0)
-- Dependencies: 230
-- Name: form_fields_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prammmoe
--

ALTER SEQUENCE public.form_fields_id_seq OWNED BY public.form_fields.id;


--
-- TOC entry 229 (class 1259 OID 18183)
-- Name: form_questions; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.form_questions (
    instructions text,
    content_item_id integer NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    id integer NOT NULL,
    question character varying(500) NOT NULL
);


ALTER TABLE public.form_questions OWNER TO prammmoe;

--
-- TOC entry 250 (class 1259 OID 18463)
-- Name: form_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: prammmoe
--

CREATE SEQUENCE public.form_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.form_questions_id_seq OWNER TO prammmoe;

--
-- TOC entry 4023 (class 0 OID 0)
-- Dependencies: 250
-- Name: form_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prammmoe
--

ALTER SEQUENCE public.form_questions_id_seq OWNED BY public.form_questions.id;


--
-- TOC entry 246 (class 1259 OID 18372)
-- Name: matching_pairs; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.matching_pairs (
    id integer NOT NULL,
    left_item character varying(255) NOT NULL,
    right_item character varying(255) NOT NULL,
    matching_question_id integer NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.matching_pairs OWNER TO prammmoe;

--
-- TOC entry 245 (class 1259 OID 18371)
-- Name: matching_pairs_id_seq; Type: SEQUENCE; Schema: public; Owner: prammmoe
--

CREATE SEQUENCE public.matching_pairs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matching_pairs_id_seq OWNER TO prammmoe;

--
-- TOC entry 4024 (class 0 OID 0)
-- Dependencies: 245
-- Name: matching_pairs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prammmoe
--

ALTER SEQUENCE public.matching_pairs_id_seq OWNED BY public.matching_pairs.id;


--
-- TOC entry 244 (class 1259 OID 18354)
-- Name: matching_questions; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.matching_questions (
    id integer NOT NULL,
    question character varying(500) NOT NULL,
    instructions text,
    content_item_id integer NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.matching_questions OWNER TO prammmoe;

--
-- TOC entry 243 (class 1259 OID 18353)
-- Name: matching_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: prammmoe
--

CREATE SEQUENCE public.matching_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matching_questions_id_seq OWNER TO prammmoe;

--
-- TOC entry 4025 (class 0 OID 0)
-- Dependencies: 243
-- Name: matching_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prammmoe
--

ALTER SEQUENCE public.matching_questions_id_seq OWNED BY public.matching_questions.id;


--
-- TOC entry 226 (class 1259 OID 18140)
-- Name: media_assets; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.media_assets (
    id integer NOT NULL,
    media_type public.media_assets_media_type_enum NOT NULL,
    url character varying(500) NOT NULL,
    duration_sec numeric,
    transcript text,
    alt_text character varying(255),
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.media_assets OWNER TO prammmoe;

--
-- TOC entry 225 (class 1259 OID 18139)
-- Name: media_assets_id_seq; Type: SEQUENCE; Schema: public; Owner: prammmoe
--

CREATE SEQUENCE public.media_assets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_assets_id_seq OWNER TO prammmoe;

--
-- TOC entry 4026 (class 0 OID 0)
-- Dependencies: 225
-- Name: media_assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prammmoe
--

ALTER SEQUENCE public.media_assets_id_seq OWNED BY public.media_assets.id;


--
-- TOC entry 219 (class 1259 OID 16723)
-- Name: migrations; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO prammmoe;

--
-- TOC entry 218 (class 1259 OID 16722)
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: prammmoe
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO prammmoe;

--
-- TOC entry 4027 (class 0 OID 0)
-- Dependencies: 218
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prammmoe
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- TOC entry 220 (class 1259 OID 18065)
-- Name: programs; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.programs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    image_url character varying(255),
    order_index integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.programs OWNER TO prammmoe;

--
-- TOC entry 242 (class 1259 OID 18335)
-- Name: quiz_options; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.quiz_options (
    id integer NOT NULL,
    option_text character varying(255) NOT NULL,
    is_correct boolean DEFAULT false NOT NULL,
    quiz_id integer NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.quiz_options OWNER TO prammmoe;

--
-- TOC entry 241 (class 1259 OID 18334)
-- Name: quiz_options_id_seq; Type: SEQUENCE; Schema: public; Owner: prammmoe
--

CREATE SEQUENCE public.quiz_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quiz_options_id_seq OWNER TO prammmoe;

--
-- TOC entry 4028 (class 0 OID 0)
-- Dependencies: 241
-- Name: quiz_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prammmoe
--

ALTER SEQUENCE public.quiz_options_id_seq OWNED BY public.quiz_options.id;


--
-- TOC entry 240 (class 1259 OID 18317)
-- Name: quizzes; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.quizzes (
    id integer NOT NULL,
    question character varying(500) NOT NULL,
    explanation text,
    content_item_id integer NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.quizzes OWNER TO prammmoe;

--
-- TOC entry 239 (class 1259 OID 18316)
-- Name: quizzes_id_seq; Type: SEQUENCE; Schema: public; Owner: prammmoe
--

CREATE SEQUENCE public.quizzes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quizzes_id_seq OWNER TO prammmoe;

--
-- TOC entry 4029 (class 0 OID 0)
-- Dependencies: 239
-- Name: quizzes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prammmoe
--

ALTER SEQUENCE public.quizzes_id_seq OWNED BY public.quizzes.id;


--
-- TOC entry 249 (class 1259 OID 18414)
-- Name: refresh_token; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.refresh_token (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp without time zone NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.refresh_token OWNER TO prammmoe;

--
-- TOC entry 248 (class 1259 OID 18390)
-- Name: roleplay_attempts; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.roleplay_attempts (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    roleplay_id integer NOT NULL,
    score integer,
    completed boolean DEFAULT false NOT NULL,
    attempt_number integer DEFAULT 1 NOT NULL,
    feedback text,
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.roleplay_attempts OWNER TO prammmoe;

--
-- TOC entry 247 (class 1259 OID 18389)
-- Name: roleplay_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: prammmoe
--

CREATE SEQUENCE public.roleplay_attempts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roleplay_attempts_id_seq OWNER TO prammmoe;

--
-- TOC entry 4030 (class 0 OID 0)
-- Dependencies: 247
-- Name: roleplay_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prammmoe
--

ALTER SEQUENCE public.roleplay_attempts_id_seq OWNED BY public.roleplay_attempts.id;


--
-- TOC entry 235 (class 1259 OID 18260)
-- Name: roleplay_turns; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.roleplay_turns (
    id integer NOT NULL,
    message text NOT NULL,
    turn_order integer NOT NULL,
    roleplay_id integer NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    speaker character varying(50) NOT NULL
);


ALTER TABLE public.roleplay_turns OWNER TO prammmoe;

--
-- TOC entry 234 (class 1259 OID 18259)
-- Name: roleplay_turns_id_seq; Type: SEQUENCE; Schema: public; Owner: prammmoe
--

CREATE SEQUENCE public.roleplay_turns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roleplay_turns_id_seq OWNER TO prammmoe;

--
-- TOC entry 4031 (class 0 OID 0)
-- Dependencies: 234
-- Name: roleplay_turns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prammmoe
--

ALTER SEQUENCE public.roleplay_turns_id_seq OWNED BY public.roleplay_turns.id;


--
-- TOC entry 233 (class 1259 OID 18237)
-- Name: roleplays; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.roleplays (
    id integer NOT NULL,
    scenario character varying(500) NOT NULL,
    instructions text,
    character_name character varying(255),
    character_description text,
    content_item_id integer NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.roleplays OWNER TO prammmoe;

--
-- TOC entry 232 (class 1259 OID 18236)
-- Name: roleplays_id_seq; Type: SEQUENCE; Schema: public; Owner: prammmoe
--

CREATE SEQUENCE public.roleplays_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roleplays_id_seq OWNER TO prammmoe;

--
-- TOC entry 4032 (class 0 OID 0)
-- Dependencies: 232
-- Name: roleplays_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prammmoe
--

ALTER SEQUENCE public.roleplays_id_seq OWNED BY public.roleplays.id;


--
-- TOC entry 224 (class 1259 OID 18098)
-- Name: unit_levels; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.unit_levels (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    "position" integer DEFAULT 0 NOT NULL,
    unit_id integer NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    level integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.unit_levels OWNER TO prammmoe;

--
-- TOC entry 223 (class 1259 OID 18097)
-- Name: unit_levels_id_seq; Type: SEQUENCE; Schema: public; Owner: prammmoe
--

CREATE SEQUENCE public.unit_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unit_levels_id_seq OWNER TO prammmoe;

--
-- TOC entry 4033 (class 0 OID 0)
-- Dependencies: 223
-- Name: unit_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prammmoe
--

ALTER SEQUENCE public.unit_levels_id_seq OWNED BY public.unit_levels.id;


--
-- TOC entry 222 (class 1259 OID 18079)
-- Name: units; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.units (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    image_url character varying(255),
    order_index integer DEFAULT 0 NOT NULL,
    program_id uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.units OWNER TO prammmoe;

--
-- TOC entry 221 (class 1259 OID 18078)
-- Name: units_id_seq; Type: SEQUENCE; Schema: public; Owner: prammmoe
--

CREATE SEQUENCE public.units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.units_id_seq OWNER TO prammmoe;

--
-- TOC entry 4034 (class 0 OID 0)
-- Dependencies: 221
-- Name: units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prammmoe
--

ALTER SEQUENCE public.units_id_seq OWNED BY public.units.id;


--
-- TOC entry 238 (class 1259 OID 18297)
-- Name: user_level_progress; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.user_level_progress (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    unit_level_id integer NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    score integer,
    attempts integer DEFAULT 0 NOT NULL,
    completed_at timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_level_progress OWNER TO prammmoe;

--
-- TOC entry 237 (class 1259 OID 18296)
-- Name: user_level_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: prammmoe
--

CREATE SEQUENCE public.user_level_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_level_progress_id_seq OWNER TO prammmoe;

--
-- TOC entry 4035 (class 0 OID 0)
-- Dependencies: 237
-- Name: user_level_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prammmoe
--

ALTER SEQUENCE public.user_level_progress_id_seq OWNED BY public.user_level_progress.id;


--
-- TOC entry 236 (class 1259 OID 18280)
-- Name: users; Type: TABLE; Schema: public; Owner: prammmoe
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "appleId" character varying(100),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO prammmoe;

--
-- TOC entry 3749 (class 2604 OID 18161)
-- Name: content_items id; Type: DEFAULT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.content_items ALTER COLUMN id SET DEFAULT nextval('public.content_items_id_seq'::regclass);


--
-- TOC entry 3757 (class 2604 OID 18219)
-- Name: form_fields id; Type: DEFAULT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.form_fields ALTER COLUMN id SET DEFAULT nextval('public.form_fields_id_seq'::regclass);


--
-- TOC entry 3756 (class 2604 OID 18464)
-- Name: form_questions id; Type: DEFAULT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.form_questions ALTER COLUMN id SET DEFAULT nextval('public.form_questions_id_seq'::regclass);


--
-- TOC entry 3792 (class 2604 OID 18375)
-- Name: matching_pairs id; Type: DEFAULT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.matching_pairs ALTER COLUMN id SET DEFAULT nextval('public.matching_pairs_id_seq'::regclass);


--
-- TOC entry 3788 (class 2604 OID 18357)
-- Name: matching_questions id; Type: DEFAULT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.matching_questions ALTER COLUMN id SET DEFAULT nextval('public.matching_questions_id_seq'::regclass);


--
-- TOC entry 3745 (class 2604 OID 18143)
-- Name: media_assets id; Type: DEFAULT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.media_assets ALTER COLUMN id SET DEFAULT nextval('public.media_assets_id_seq'::regclass);


--
-- TOC entry 3730 (class 2604 OID 16726)
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- TOC entry 3783 (class 2604 OID 18338)
-- Name: quiz_options id; Type: DEFAULT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.quiz_options ALTER COLUMN id SET DEFAULT nextval('public.quiz_options_id_seq'::regclass);


--
-- TOC entry 3779 (class 2604 OID 18320)
-- Name: quizzes id; Type: DEFAULT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.quizzes ALTER COLUMN id SET DEFAULT nextval('public.quizzes_id_seq'::regclass);


--
-- TOC entry 3796 (class 2604 OID 18393)
-- Name: roleplay_attempts id; Type: DEFAULT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.roleplay_attempts ALTER COLUMN id SET DEFAULT nextval('public.roleplay_attempts_id_seq'::regclass);


--
-- TOC entry 3767 (class 2604 OID 18263)
-- Name: roleplay_turns id; Type: DEFAULT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.roleplay_turns ALTER COLUMN id SET DEFAULT nextval('public.roleplay_turns_id_seq'::regclass);


--
-- TOC entry 3763 (class 2604 OID 18240)
-- Name: roleplays id; Type: DEFAULT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.roleplays ALTER COLUMN id SET DEFAULT nextval('public.roleplays_id_seq'::regclass);


--
-- TOC entry 3739 (class 2604 OID 18101)
-- Name: unit_levels id; Type: DEFAULT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.unit_levels ALTER COLUMN id SET DEFAULT nextval('public.unit_levels_id_seq'::regclass);


--
-- TOC entry 3735 (class 2604 OID 18082)
-- Name: units id; Type: DEFAULT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.units ALTER COLUMN id SET DEFAULT nextval('public.units_id_seq'::regclass);


--
-- TOC entry 3774 (class 2604 OID 18300)
-- Name: user_level_progress id; Type: DEFAULT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.user_level_progress ALTER COLUMN id SET DEFAULT nextval('public.user_level_progress_id_seq'::regclass);


--
-- TOC entry 3809 (class 2606 OID 18089)
-- Name: units PK_5a8f2f064919b587d93936cb223; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY (id);


--
-- TOC entry 3817 (class 2606 OID 18471)
-- Name: form_questions PK_79b081029ae61e3761034f88c85; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.form_questions
    ADD CONSTRAINT "PK_79b081029ae61e3761034f88c85" PRIMARY KEY (id);


--
-- TOC entry 3805 (class 2606 OID 16730)
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- TOC entry 3811 (class 2606 OID 18109)
-- Name: unit_levels PK_9bcf9b9692d907e0159d75da0cb; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.unit_levels
    ADD CONSTRAINT "PK_9bcf9b9692d907e0159d75da0cb" PRIMARY KEY (id);


--
-- TOC entry 3851 (class 2606 OID 18423)
-- Name: refresh_token PK_b575dd3c21fb0831013c909e7fe; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY (id);


--
-- TOC entry 3813 (class 2606 OID 18150)
-- Name: media_assets PK_ca47e9f67a5e5d8af1e75d66ee6; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.media_assets
    ADD CONSTRAINT "PK_ca47e9f67a5e5d8af1e75d66ee6" PRIMARY KEY (id);


--
-- TOC entry 3843 (class 2606 OID 18477)
-- Name: matching_questions UQ_897bda57b7ace53ce88f81b660b; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.matching_questions
    ADD CONSTRAINT "UQ_897bda57b7ace53ce88f81b660b" UNIQUE (content_item_id);


--
-- TOC entry 3833 (class 2606 OID 18637)
-- Name: user_level_progress UQ_aeb116f7319bfe407e000103731; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.user_level_progress
    ADD CONSTRAINT "UQ_aeb116f7319bfe407e000103731" UNIQUE (user_id, unit_level_id);


--
-- TOC entry 3853 (class 2606 OID 18425)
-- Name: refresh_token UQ_c31d0a2f38e6e99110df62ab0af; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT "UQ_c31d0a2f38e6e99110df62ab0af" UNIQUE (token);


--
-- TOC entry 3837 (class 2606 OID 18485)
-- Name: quizzes UQ_cef2181f3361569a483169b3c0e; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT "UQ_cef2181f3361569a483169b3c0e" UNIQUE (content_item_id);


--
-- TOC entry 3819 (class 2606 OID 18473)
-- Name: form_questions UQ_d078e8222f2f749fc1c11e2ccea; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.form_questions
    ADD CONSTRAINT "UQ_d078e8222f2f749fc1c11e2ccea" UNIQUE (content_item_id);


--
-- TOC entry 3823 (class 2606 OID 18475)
-- Name: roleplays UQ_fc855aec9818f8b26c66fc0f412; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.roleplays
    ADD CONSTRAINT "UQ_fc855aec9818f8b26c66fc0f412" UNIQUE (content_item_id);


--
-- TOC entry 3815 (class 2606 OID 18168)
-- Name: content_items content_items_pkey; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.content_items
    ADD CONSTRAINT content_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3821 (class 2606 OID 18228)
-- Name: form_fields form_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.form_fields
    ADD CONSTRAINT form_fields_pkey PRIMARY KEY (id);


--
-- TOC entry 3847 (class 2606 OID 18382)
-- Name: matching_pairs matching_pairs_pkey; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.matching_pairs
    ADD CONSTRAINT matching_pairs_pkey PRIMARY KEY (id);


--
-- TOC entry 3845 (class 2606 OID 18364)
-- Name: matching_questions matching_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.matching_questions
    ADD CONSTRAINT matching_questions_pkey PRIMARY KEY (id);


--
-- TOC entry 3807 (class 2606 OID 18075)
-- Name: programs programs_pkey; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);


--
-- TOC entry 3841 (class 2606 OID 18346)
-- Name: quiz_options quiz_options_pkey; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.quiz_options
    ADD CONSTRAINT quiz_options_pkey PRIMARY KEY (id);


--
-- TOC entry 3839 (class 2606 OID 18327)
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);


--
-- TOC entry 3849 (class 2606 OID 18401)
-- Name: roleplay_attempts roleplay_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.roleplay_attempts
    ADD CONSTRAINT roleplay_attempts_pkey PRIMARY KEY (id);


--
-- TOC entry 3827 (class 2606 OID 18270)
-- Name: roleplay_turns roleplay_turns_pkey; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.roleplay_turns
    ADD CONSTRAINT roleplay_turns_pkey PRIMARY KEY (id);


--
-- TOC entry 3825 (class 2606 OID 18247)
-- Name: roleplays roleplays_pkey; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.roleplays
    ADD CONSTRAINT roleplays_pkey PRIMARY KEY (id);


--
-- TOC entry 3835 (class 2606 OID 18306)
-- Name: user_level_progress user_level_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.user_level_progress
    ADD CONSTRAINT user_level_progress_pkey PRIMARY KEY (id);


--
-- TOC entry 3829 (class 2606 OID 18291)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3831 (class 2606 OID 18289)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3868 (class 2606 OID 18495)
-- Name: roleplay_attempts FK_0d591f3a4e2a530041b5c5c790b; Type: FK CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.roleplay_attempts
    ADD CONSTRAINT "FK_0d591f3a4e2a530041b5c5c790b" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3862 (class 2606 OID 18638)
-- Name: user_level_progress FK_1dd4262244a998c3c451f264207; Type: FK CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.user_level_progress
    ADD CONSTRAINT "FK_1dd4262244a998c3c451f264207" FOREIGN KEY (unit_level_id) REFERENCES public.unit_levels(id);


--
-- TOC entry 3856 (class 2606 OID 18520)
-- Name: content_items FK_3919d2a7cd76a3ed170a56635b4; Type: FK CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.content_items
    ADD CONSTRAINT "FK_3919d2a7cd76a3ed170a56635b4" FOREIGN KEY (media_asset_id) REFERENCES public.media_assets(id);


--
-- TOC entry 3863 (class 2606 OID 18490)
-- Name: user_level_progress FK_4355054fdcdada5960bfcf8332a; Type: FK CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.user_level_progress
    ADD CONSTRAINT "FK_4355054fdcdada5960bfcf8332a" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3859 (class 2606 OID 18525)
-- Name: form_fields FK_4b8db79242623f739b36217a18d; Type: FK CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.form_fields
    ADD CONSTRAINT "FK_4b8db79242623f739b36217a18d" FOREIGN KEY (form_question_id) REFERENCES public.form_questions(id) ON DELETE CASCADE;


--
-- TOC entry 3861 (class 2606 OID 18535)
-- Name: roleplay_turns FK_56f04a592dde1d8e67bd2e7e345; Type: FK CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.roleplay_turns
    ADD CONSTRAINT "FK_56f04a592dde1d8e67bd2e7e345" FOREIGN KEY (roleplay_id) REFERENCES public.roleplays(id) ON DELETE CASCADE;


--
-- TOC entry 3867 (class 2606 OID 18550)
-- Name: matching_pairs FK_63e6c66f00d183277ab523ad212; Type: FK CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.matching_pairs
    ADD CONSTRAINT "FK_63e6c66f00d183277ab523ad212" FOREIGN KEY (matching_question_id) REFERENCES public.matching_questions(id) ON DELETE CASCADE;


--
-- TOC entry 3855 (class 2606 OID 18510)
-- Name: unit_levels FK_6f07bfc683b1d9a7aca9f087ac5; Type: FK CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.unit_levels
    ADD CONSTRAINT "FK_6f07bfc683b1d9a7aca9f087ac5" FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 3857 (class 2606 OID 18515)
-- Name: content_items FK_7f5ecf1472b5839b73731e57b4f; Type: FK CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.content_items
    ADD CONSTRAINT "FK_7f5ecf1472b5839b73731e57b4f" FOREIGN KEY (unit_level_id) REFERENCES public.unit_levels(id) ON DELETE CASCADE;


--
-- TOC entry 3866 (class 2606 OID 18545)
-- Name: matching_questions FK_897bda57b7ace53ce88f81b660b; Type: FK CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.matching_questions
    ADD CONSTRAINT "FK_897bda57b7ace53ce88f81b660b" FOREIGN KEY (content_item_id) REFERENCES public.content_items(id) ON DELETE CASCADE;


--
-- TOC entry 3854 (class 2606 OID 18505)
-- Name: units FK_8e49f46215b59323933c5802c15; Type: FK CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT "FK_8e49f46215b59323933c5802c15" FOREIGN KEY (program_id) REFERENCES public.programs(id);


--
-- TOC entry 3869 (class 2606 OID 18500)
-- Name: refresh_token FK_8e913e288156c133999341156ad; Type: FK CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3865 (class 2606 OID 18555)
-- Name: quiz_options FK_a0efc5e4e9ceec3f2141ced69c4; Type: FK CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.quiz_options
    ADD CONSTRAINT "FK_a0efc5e4e9ceec3f2141ced69c4" FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;


--
-- TOC entry 3864 (class 2606 OID 18560)
-- Name: quizzes FK_cef2181f3361569a483169b3c0e; Type: FK CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT "FK_cef2181f3361569a483169b3c0e" FOREIGN KEY (content_item_id) REFERENCES public.content_items(id) ON DELETE CASCADE;


--
-- TOC entry 3858 (class 2606 OID 18530)
-- Name: form_questions FK_d078e8222f2f749fc1c11e2ccea; Type: FK CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.form_questions
    ADD CONSTRAINT "FK_d078e8222f2f749fc1c11e2ccea" FOREIGN KEY (content_item_id) REFERENCES public.content_items(id) ON DELETE CASCADE;


--
-- TOC entry 3860 (class 2606 OID 18540)
-- Name: roleplays FK_fc855aec9818f8b26c66fc0f412; Type: FK CONSTRAINT; Schema: public; Owner: prammmoe
--

ALTER TABLE ONLY public.roleplays
    ADD CONSTRAINT "FK_fc855aec9818f8b26c66fc0f412" FOREIGN KEY (content_item_id) REFERENCES public.content_items(id) ON DELETE CASCADE;


-- Completed on 2025-09-19 16:06:09 WIB

--
-- PostgreSQL database dump complete
--

