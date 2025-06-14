import express, { Request, Response, Express } from "express";
import request from "supertest";
import { processQuery } from "../src/handlers";

const app: Express = express();
app.use(express.json());

const queryHandler = async (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) {
    res.status(400).json({ error: "Missing query" });
    return;
  }

  const result = await processQuery(query);
  res.json({ result });
};

app.post("/query", queryHandler);

describe("POST /query", () => {
  it("responds with generated answer", async () => {
    const response = await request(app)
      .post("/query")
      .send({ query: "What is the capital of France?" })
      .expect(200);

    expect(response.body.result).toBeDefined();
    expect(typeof response.body.result).toBe("string");
  });

  it("rejects missing query field", async () => {
    const response = await request(app).post("/query").send({});
    expect(response.status).toBe(400);
  });
});
