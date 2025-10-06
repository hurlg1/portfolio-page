export async function handler(event, context) {
  const apiKey = process.env.API_FOOTBALL_KEY; 
  const url = "https://api-football-v1.p.rapidapi.com/v3/standings?season=2025&league=140";

  try {
    const response = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com"
      }
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
