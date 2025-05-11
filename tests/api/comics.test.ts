import { expect } from 'chai';
import supertest from 'supertest';

describe('Comics API', () => {
    let request: ReturnType<typeof supertest>;

    before(async () => {
        request = supertest('http://localhost:3000');
    });

    describe('POST /api/comics/upload', () => {
        it('should upload an image', async () => {
            const response = await request
                .post('/api/comics/upload')
                .attach('file', Buffer.from('test'), 'test.png')
                .field('characterName', 'Rodgers');

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('ipfsHash').that.is.a('string');
            expect(response.body).to.have.property('ipfsURI').that.includes('ipfs://');
            expect(response.body).to.have.property('characterName', 'Rodgers');
        });

        it('should fail with missing file', async () => {
            const response = await request
                .post('/api/comics/upload')
                .field('characterName', 'Rodgers');

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'File and characterName are required');
        });
    });

    describe('POST /api/comics/generate', () => {
        it('should generate a comic', async () => {
            const payload = {
                story: 'Rodgers the engineer saves the day',
                images: [{ characterName: 'Rodgers', ipfsURI: 'ipfs://QmTestImage' }],
            };

            const response = await request
                .post('/api/comics/generate')
                .set('Content-Type', 'application/json')
                .send(payload);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('comic').that.is.an('object');
        });

        it('should fail with missing story', async () => {
            const payload = {
                images: [{ characterName: 'Rodgers', ipfsURI: 'ipfs://QmTestImage' }],
            };

            const response = await request
                .post('/api/comics/generate')
                .set('Content-Type', 'application/json')
                .send(payload);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Story is required');
        });
    });

    describe('POST /api/comics/preview', () => {
        it('should generate a preview', async () => {
            const payload = {
                comic: {
                    name: 'Test Comic',
                    description: 'Page 1\nPage 2',
                    image: 'ipfs://QmTestImage',
                    attributes: [],
                },
            };

            const response = await request
                .post('/api/comics/preview')
                .set('Content-Type', 'application/json')
                .send(payload);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('preview').that.has.property('pages').that.is.an('array');
        });
    });

    describe('POST /api/comics/mint', () => {
        it('should mint a comic NFT', async () => {
            const payload = {
                metadata: {
                    name: 'Test Comic',
                    description: 'A superhero adventure',
                    image: 'ipfs://QmTestImage',
                    attributes: [],
                },
                recipient: process.env.NEXT_PUBLIC_WALLET_ADDRESS_SELLER,
                royalty: 500,
            };

            const response = await request
                .post('/api/comics/mint')
                .set('Content-Type', 'application/json')
                .send(payload);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('tokenId').that.is.a('string');
            expect(response.body).to.have.property('transactionHash').that.matches(/^0x[a-fA-F0-9]{64}$/);
            expect(response.body).to.have.property('metadataURI').that.includes('ipfs://');
        });
    });

    describe('GET /api/comics/[tokenId]', () => {
        it('should get comic details', async () => {
            const response = await request.get('/api/comics/0');

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('tokenId', '0');
            expect(response.body).to.have.property('owner').that.matches(/^0x[a-fA-F0-9]{40}$/);
            expect(response.body).to.have.property('listing').that.has.property('isListed');
        });
    });
});