
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
