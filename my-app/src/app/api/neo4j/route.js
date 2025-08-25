import neo4j from "neo4j-driver";

// 🔑 Local Neo4j credentials
const driver = neo4j.driver(
  "bolt://localhost:7687",      // local DB URI
  neo4j.auth.basic("neo4j", "hatdog123") // user + password you set
);

export async function GET() {
  const session = driver.session();
  try {
    // Simple test query
    const result = await session.run("RETURN 'Hello from Neo4j' AS message");
    const message = result.records[0].get("message");

    return new Response(JSON.stringify({ message }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    await session.close();
  }
}