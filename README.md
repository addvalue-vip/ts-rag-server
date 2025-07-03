# 📘 RAG Server API

This server provides two main endpoints:

* `POST /ingest`: Ingests and stores documents (as chunks + embeddings) into Supabase.
* `POST /query`: Accepts a natural language query and returns a generated response based on retrieved relevant document chunks.

---

## 🔁 POST `/ingest`

Ingest a raw document for chunking, embedding, and storage in Supabase.

### Request

**URL**: `/ingest`
**Method**: `POST`
**Content-Type**: `application/json`

### Request Body

```json
{
  "doc_id": "unique_doc_identifier",
  "text": "This is the full document text to be split, embedded, and stored."
}
```

### Response

**Success**: `200 OK`

```json
{
  "message": "✅ Document unique_doc_identifier ingested successfully"
}
```

**Failure**: `400 Bad Request` or `500 Internal Server Error`

```json
{
  "error": "Missing 'doc_id' or 'text' in request body"
}
```

---

## 💬 POST `/query`

Process a user query by retrieving relevant chunks and generating a contextual answer.

### Request

**URL**: `/query`
**Method**: `POST`
**Content-Type**: `application/json`

### Request Body

```json
{
  "query": "What does the document say about XYZ?"
}
```

### Response

**Success**: `200 OK`

```json
{
  "result": "The document discusses XYZ in the following way..."
}
```

**Failure**: `400 Bad Request` or `500 Internal Server Error`

```json
{
  "error": "Missing query field"
}
```

---

## ⚙️ Configuration

Ensure your `.env` file includes:

```env
OPENAI_API_KEY=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_URL=
```

---

Let me know if you want to include curl examples, authentication notes, or Docker usage instructions.
📘 RAG Server API
This server provides two main endpoints:

POST /ingest: Ingests and stores documents (as chunks + embeddings) into Supabase.

POST /query: Accepts a natural language query and returns a generated response based on retrieved relevant document chunks.

🔁 POST /ingest
Ingest a raw document for chunking, embedding, and storage in Supabase.

Request
URL: /ingest
Method: POST
Content-Type: application/json

Request Body
{
  "doc_id": "unique_doc_identifier",
  "text": "This is the full document text to be split, embedded, and stored."
}

