import {base64encode} from 'nodejs-base64';
import {
    getLatestPostsFromSubreddit,
    sendToDiscordWebhook,
} from '@/util/networking';
import {getHashFromS3, saveHashToS3} from '@/util/s3';
import {createEmbed} from './util/discord';

const {WEBHOOK_URL = ''} = process.env;

export type Maybe<T> = T | null | undefined;

function compareHashes(oldHash: Maybe<string>, newHash: string): boolean {
    return oldHash === newHash;
}

/**
 * Lambda handler
 */
export async function handler(): Promise<void> {
    const data = await getLatestPostsFromSubreddit('kopieerpasta');
    const newestPost = data.data.children[0].data;
    const [newHash, oldHash] = [
        base64encode(JSON.stringify(newestPost.selftext)) as string,
        (await getHashFromS3())?.hash,
    ];

    if (!compareHashes(oldHash, newHash)) {
        await saveHashToS3(newHash);
        await sendToDiscordWebhook(WEBHOOK_URL, {
            avatar_url:
                'https://external-preview.redd.it/iDdntscPf-nfWKqzHRGFmhVxZm4hZgaKe5oyFws-yzA.png?width=640&crop=smart&auto=webp&s=bfd318557bf2a5b3602367c9c4d9cd84d917ccd5',
            content: null,
            username: 'r/kopieerpasta',
            embeds: [await createEmbed(data.data.children[0])],
        });
    }
}
