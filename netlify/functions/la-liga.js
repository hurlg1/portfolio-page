export async function handler(event, context) {
  const apiKey = process.env.API_FOOTBALL_KEY; 
  const url = "https://api.football-data.org/v4/competitions/PD/standings";

  try {
    const response = await fetch(url, {
      headers: { "X-Auth-Token": apiKey }
    });
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
