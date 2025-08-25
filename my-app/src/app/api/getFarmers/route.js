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
    // THIS QUERY NOW SPECIFICALLY SELECTS THE 4 DEMO FARMERS
    const cypherQuery = `
      MATCH (f:Farmer)
      WHERE f.id IN ['f01', 'f02', 'f03', 'f04', 'f05']
      OPTIONAL MATCH (f)-[:REFERRED]->(r:Farmer)
      WITH f, collect(r { .id, .name, .profileImage, .location }) AS referrals
      RETURN
        f.id AS id,
        f.name AS name,
        f.profileImage AS profileImage,
        f.location AS location,
        size(referrals) AS directReferrals,
        COUNT { (f)-[:PAID_ON_TIME]->() } AS onTimePayments,
        COUNT { (f)-[:PAID_LATE]->() } AS latePayments,
        referrals
      ORDER BY f.id
    `;
    const result = await session.run(cypherQuery);
    
    const farmersFromDb = result.records.map(record => {
        const farmer = record.toObject();
        return {
            ...farmer,
            directReferrals: farmer.directReferrals.low,
            onTimePayments: farmer.onTimePayments.low,
            latePayments: farmer.latePayments.low,
            referrals: farmer.referrals.map(ref => ({
                id: ref.id,
                name: ref.name,
                profileImage: ref.profileImage,
                location: ref.location
            }))
        };
    });

    const enrichedFarmers = await Promise.all(
      farmersFromDb.map(async (farmer) => {
        try {
          const response = await fetch(`http://127.0.0.1:5001/predict/${farmer.id}`);
          if (!response.ok) {
            return { ...farmer, tiwalaIndex: 0, antas: 'Error' };
          }
          const scoreData = await response.json();
          return {
            ...farmer,
            tiwalaIndex: scoreData.tiwala_index,
            antas: calculateAntas(scoreData.tiwala_index),
          };
        } catch (error) {
          return { ...farmer, tiwalaIndex: 0, antas: 'Error' };
        }
      })
    );

    return Response.json(enrichedFarmers);

  } catch (error) {
    return Response.json({ error: 'Failed to fetch data.', details: error.message }, { status: 500 });
  } finally {
    await session.close();
  }
}