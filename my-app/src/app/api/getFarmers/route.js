import neo4j from 'neo4j-driver';

function calculateAntas(tiwalaIndex) {
  if (tiwalaIndex >= 950) return "Alamat";
  if (tiwalaIndex >= 800) return "Katiwala";
  if (tiwalaIndex >= 600) return "Matatag";
  if (tiwalaIndex >= 400) return "Umuusbong";
  return "Baguhan";
}

const URI = 'bolt://localhost:7687';
const USER = 'neo4j';
const PASSWORD = 'hatdog123';

let driver;
try {
  driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
} catch (error) {
  console.error('Could not create Neo4j driver instance', error);
}

export async function GET(request) {
  if (!driver) {
    return Response.json({ error: 'Database connection not configured.' }, { status: 500 });
  }

  const session = driver.session();
  try {
    const cypherQuery = `
      MATCH (f:Farmer)
      RETURN
        f.id AS id,
        f.name AS name,
        f.profileImage AS profileImage,
        f.location AS location,
        COUNT { (f)-[:REFERRED]->() } AS directReferrals,
        COUNT { (f)-[:PAID_ON_TIME]->() } AS onTimePayments,
        // This line correctly fetches the late payment count
        COUNT { (f)-[:PAID_LATE]->() } AS latePayments
      ORDER BY f.name
    `;
    const result = await session.run(cypherQuery);
    
    // Convert Neo4j integers to standard numbers
    const farmersFromDb = result.records.map(record => {
        const farmer = record.toObject();
        return {
            ...farmer,
            directReferrals: farmer.directReferrals.low,
            onTimePayments: farmer.onTimePayments.low,
            // This line correctly processes the late payment count
            latePayments: farmer.latePayments.low
        };
    });

    const enrichedFarmers = await Promise.all(
      farmersFromDb.map(async (farmer) => {
        try {
          const response = await fetch(`http://127.0.0.1:5001/predict/${farmer.id}`);
          if (!response.ok) {
            console.error(`Python API returned an error for ${farmer.id}: ${response.status}`);
            return { ...farmer, tiwalaIndex: 0, antas: 'Error' };
          }
          
          const scoreData = await response.json();
          return {
            ...farmer,
            tiwalaIndex: scoreData.tiwala_index,
            antas: calculateAntas(scoreData.tiwala_index),
          };
        } catch (error) {
          console.error(`Failed to fetch from Python API for ${farmer.id}:`, error.message);
          return { ...farmer, tiwalaIndex: 0, antas: 'Error' };
        }
      })
    );

    return Response.json(enrichedFarmers);

  } catch (error) {
    console.error('Error in API route:', error);
    return Response.json({ error: 'Failed to fetch data.', details: error.message }, { status: 500 });
  } finally {
    await session.close();
  }
}