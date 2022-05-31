import {GetObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import type {Readable} from 'stream';
import {Maybe} from '..';

const {S3_BUCKET} = process.env;

const HASH_FILE_KEY = 'hash.json';

const s3Client = new S3Client({});

/**
 * Converts readable stream to string
 * @see https://github.com/aws/aws-sdk-js-v3/issues/1877
 */
export async function streamToString(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () =>
            resolve(Buffer.concat(chunks).toString('utf-8')),
        );
    });
}

/**
 * Get prev hash from s3
 */
export async function getHashFromS3(): Promise<Maybe<{hash: string}>> {
    try {
        const cmd = new GetObjectCommand({
            Bucket: S3_BUCKET,
            Key: HASH_FILE_KEY,
        });
        const {Body} = await s3Client.send(cmd);
        const stringBody = await streamToString(Body as Readable);

        return JSON.parse(stringBody) as {
            hash: string;
        };
    } catch (err) {
        console.error('getHashFromS3', err);
        return null;
    }
}

/**
 * Save new hash to s3
 */
export async function saveHashToS3(hash: string): Promise<boolean> {
    try {
        const cmd = new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: HASH_FILE_KEY,
            Body: JSON.stringify({
                hash,
            }),
        });

        await s3Client.send(cmd);
        return true;
    } catch (err) {
        console.error('saveHashToS3', err);
        return false;
    }
}
