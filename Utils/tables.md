# tipology #
```text

-- Table: public.tipology

-- DROP TABLE IF EXISTS public.tipology;

CREATE TABLE IF NOT EXISTS public.tipology
(
    id integer NOT NULL DEFAULT nextval('tipology_id_seq'::regclass),
    nome character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tipology_pkey PRIMARY KEY (id),
    CONSTRAINT tipology_nome_key UNIQUE (nome)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tipology
    OWNER to postgres;

```
# trips #
```text
DROP TABLE IF EXISTS public.trips;

CREATE TABLE public.trips (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    date TIMESTAMP DEFAULT now(),
    isfavorite BOOLEAN DEFAULT false,
    location TEXT,
    ripeti BOOLEAN DEFAULT false,
    start_date DATE,
    end_date DATE
);

ALTER TABLE public.trips OWNER TO postgres;

```
# trips images #
```text
DROP TABLE IF EXISTS public.trip_images;

CREATE TABLE public.trip_images (
id SERIAL PRIMARY KEY,
trip_id INTEGER,
image BYTEA NOT NULL,
CONSTRAINT trip_images_trip_id_fkey FOREIGN KEY (trip_id)
REFERENCES public.trips (id)
ON UPDATE NO ACTION
ON DELETE CASCADE
);

ALTER TABLE public.trip_images OWNER TO postgres;

```
