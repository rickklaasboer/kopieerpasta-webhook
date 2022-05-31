import fetch from "node-fetch";

export type SubredditNewResponse = {
  kind: string;
  data: {
    after: string;
    modhash: string;
    geo_filter: string;
    children: {
      kind: "string";
      data: Record<string, unknown> & { selftext: string };
    }[];
  };
};

export type DiscordWebhookPayload = {
  username: string;
  avatar_url: string;
  content: string;
  embeds?: Array<{
    [key: string]: {
      [key: string]: string;
    };
  }>;
};

/**
 * Get latest post from subreddit
 */
export async function getLatestPostsFromSubreddit(
  subreddit: string
): Promise<SubredditNewResponse> {
  const request = await fetch(`https://reddit.com/r/${subreddit}/new.json`);
  const response = (await request.json()) as SubredditNewResponse;

  return response;
}

/**
 * Send payload to discord webhook
 */
export async function sendToDiscordWebhook(
  url: string,
  payload: DiscordWebhookPayload
) {
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Failed to send to discord: ", err);
  }
}
