
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
