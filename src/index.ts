
import express from "express";
import { ingestDocument } from "./ingest";
import { processQuery } from "./handlers";
import { logError, logInfo } from "./logger";

console.log("logger is working");

const app = express();
app.use(express.json());


app.post("/query", async (req: express.Request, res: express.Response) => {
  const { query } = req.body;

  console.log("Received query request:", req.body);

  if (!query) {
    console.log("Missing 'query' in request body");
    res.status(400).json({ error: "Missing 'query' field" });
  }

  try {
    console.log("⚙️ Calling processQuery with:", query);
    const result = await processQuery(query); // ✅ await here
    console.log("processQuery result:", result);

    res.status(200).json({ message: result })
  } catch (error) {
    console.error("Error in /query route:", error);
    res.status(500).json({ error: "Failed to process query" });
  }
});


app.post("/ingest", async (req: express.Request, res: express.Response) => {
  const { doc_id, text } = req.body;

  console.log("Received ingest request:", req.body);

  if (!doc_id || !text) {
    console.log("Missing 'doc_id' or 'text' in request body");
    res.status(400).json({ error: "Missing 'doc_id' or 'text' in request body" });
  }

  try {
    logInfo(`Ingesting document: ${doc_id}`);
    await ingestDocument(doc_id, text);
    console.log(`Document ${doc_id} ingested successfully`);

    res.status(200).json({ message: `✅ Document ${doc_id} ingested successfully` });
  } catch (err) {
    console.error("Ingestion failed:", err);
    res.status(500).json({ error: "Failed to ingest document" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 RAG server running on http://localhost:${PORT}`);
});

