import {
    getRedditUserDetailsByUsername,
    SubredditNewResponseChild,
} from './networking';

export type DiscordEmbed = {
    title: string;
    description: string;
    url: string;
    color: number;
    author: {
        name: string;
        url: string;
        icon_url: string;
    };
    footer: {
        text: string;
    };
    timestamp: string;
};

/**
 * Create discord embed from reddit response
 */
export async function createEmbed({
    data: {title, selftext, author, url, subreddit, created_utc},
}: SubredditNewResponseChild): Promise<DiscordEmbed> {
    const {icon, name} = await getRedditUserDetailsByUsername(author);

    return {
        title,
        description: selftext,
        url,
        author: {
            icon_url: icon,
            name: `u/${name}`,
            url: `https://reddit.com/u/${name}`,
        },
        color: 5814783,
        footer: {
            text: `Posted on r/${subreddit}`,
        },
        timestamp: new Date(created_utc * 1000).toISOString(),
    };
}
