import axios from "axios";

export async function GET() {
  const response = await axios.get(
    "https://v3.football.api-sports.io/fixtures?league=1&season=2022",
    {
      headers: {
        "x-apisports-key": process.env.API_FOOTBALL_KEY,
      },
    }
  );

  return Response.json(response.data);
}