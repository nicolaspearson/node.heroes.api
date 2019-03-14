CREATE TABLE public.heroes (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT,
    identity TEXT,
    hometown TEXT,
    age INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);
