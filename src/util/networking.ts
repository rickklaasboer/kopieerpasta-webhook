import fetch from 'node-fetch';
import {Maybe} from '..';
import {DiscordEmbed} from './discord';

export type SubredditNewResponseChild = {
    kind: 'string';
    data: {
        selftext: string;
        author: string;
        subreddit: string;
        title: string;
        url: string;
        permalink: string;
        created_utc: number;
    };
};

export type SubredditNewResponse = {
    kind: string;
    data: {
        after: string;
        modhash: string;
        geo_filter: string;
        children: Array<SubredditNewResponseChild>;
    };
};

export type RedditUserResponse = {
    kind: string;
    data: {
        icon_img: string;
        name: string;
    };
};

export type RedditUser = {
    name: string;
    icon: string;
};

export type DiscordWebhookPayload = {
    username: string;
    avatar_url: string;
    content: Maybe<string>;
    embeds?: Array<DiscordEmbed>;
};

/**
 * Get latest post from subreddit
 */
export async function getLatestPostsFromSubreddit(
    subreddit: string,
): Promise<SubredditNewResponse> {
    const request = await fetch(`https://reddit.com/r/${subreddit}/new.json`);
    const response = (await request.json()) as SubredditNewResponse;

    return response;
}

/**
 * Get Reddit profile by username
 */
export async function getRedditUserDetailsByUsername(
    username: string,
): Promise<RedditUser> {
    const request = await fetch(`https://reddit.com/u/${username}/about.json`);
    const {
        data: {icon_img, name},
    } = (await request.json()) as RedditUserResponse;

    // Remove GET parameters from icon_img
    const icon = icon_img.split('?')[0];

    return {
        name,
        icon,
    };
}

/**
 * Send payload to discord webhook
 */
export async function sendToDiscordWebhook(
    url: string,
    payload: DiscordWebhookPayload,
) {
    console.log(JSON.stringify(payload));

    try {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
    } catch (err) {
        console.error('Failed to send to discord: ', err);
    }
}
