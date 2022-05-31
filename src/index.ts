import md5 from 'md5';
import {
    getLatestPostsFromSubreddit,
    sendToDiscordWebhook,
} from '@/util/networking';
import {getHashFromS3, saveHashToS3} from '@/util/s3';

const {WEBHOOK_URL = ''} = process.env;

export type Maybe<T> = T | null | undefined;

function compareHashes(oldHash: Maybe<string>, newHash: string): boolean {
    return oldHash !== newHash;
}

/**
 * Lambda handler
 */
export async function handler(): Promise<void> {
    const data = await getLatestPostsFromSubreddit('kopieerpasta');
    const newestPost = data.data.children[0].data;
    const [newHash, oldHash] = [
        md5(JSON.stringify(newestPost)),
        (await getHashFromS3())?.hash,
    ];

    console.log({
        newHash,
        oldHash,
        compareHashes: compareHashes(oldHash, newHash),
    });

    if (compareHashes(oldHash, newHash)) {
        await saveHashToS3(newHash);
        await sendToDiscordWebhook(WEBHOOK_URL, {
            avatar_url:
                'https://external-preview.redd.it/iDdntscPf-nfWKqzHRGFmhVxZm4hZgaKe5oyFws-yzA.png?width=640&crop=smart&auto=webp&s=bfd318557bf2a5b3602367c9c4d9cd84d917ccd5',
            content: newestPost.selftext,
            username: 'r/kopieerpasta',
        });
    }
}