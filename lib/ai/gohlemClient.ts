type AssistantRequest = {
  message: string;
  cartSummary: string;
};

export async function sendToGohlemBrain({ message, cartSummary }: AssistantRequest) {
  const endpoint = process.env.GOHLEM_API_URL;
  const apiKey = process.env.GOHLEM_API_KEY;

  if (!endpoint || !apiKey) {
    return {
      reply:
        "The ordering brain is not connected yet. Frontend integration is ready for GOHLEM_API_URL and GOHLEM_API_KEY."
    };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      message,
      cartSummary,
      restaurant: "Hot Bagels 2nd Street"
    })
  });

  if (!response.ok) {
    throw new Error(`Gohlem.ai request failed with ${response.status}`);
  }

  return (await response.json()) as { reply: string };
}
