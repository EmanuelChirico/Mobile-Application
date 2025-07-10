# tipology #
```text

CREATE TABLE tipology (
    nome VARCHAR(30) PRIMARY KEY NOT NULL
);

```
# trips #
```text
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image BYTEA,
    date TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    category VARCHAR(30),
    isfavorite BOOLEAN DEFAULT FALSE,
    ripeti BOOLEAN DEFAULT FALSE,
    location VARCHAR(255)
);

```

