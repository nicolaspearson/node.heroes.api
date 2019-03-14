CREATE TABLE public.heroes (
    id integer NOT NULL,
    name text,
    identity text,
    hometown text,
    age integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);

ALTER TABLE public.heroes OWNER TO master;

CREATE SEQUENCE public.heroes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.heroes_id_seq OWNER TO master;

ALTER SEQUENCE public.heroes_id_seq OWNED BY public.heroes.id;

ALTER TABLE ONLY public.heroes ALTER COLUMN id SET DEFAULT nextval('public.heroes_id_seq'::regclass);

ALTER TABLE ONLY public.heroes ADD CONSTRAINT heroes_pkey PRIMARY KEY (id);

CREATE INDEX idx_heroes_deleted_at ON public.heroes USING btree (deleted_at);
