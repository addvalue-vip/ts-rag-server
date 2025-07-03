
-- Enable the pgvector extension if it hasn't been already
create extension if not exists vector;

-- Create the rag_chunks table
create table if not exists rag_chunks (
  id uuid primary key default gen_random_uuid(),
  doc_id text not null,
  chunk text not null,
  embedding vector(1536), -- embedding length depends on your model (e.g., ada-002 = 1536)
  created_at timestamptz default now()
);


create or replace function match_rag_chunks(
  query_embedding vector(1536),
  match_threshold float,
match_count int
)
returns table (
  id uuid,
  chunk text,
  similarity float
)
language sql stable
as $$
  select
    id,
    chunk,
    1 - (embedding <=> query_embedding) as similarity
  from rag_chunks
  where embedding <=> query_embedding < 1 - match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;

