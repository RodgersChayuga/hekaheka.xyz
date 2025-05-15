import { expect } from 'chai';
import supertest from 'supertest';

describe('Marketplace API', () => {
    let request: ReturnType<typeof supertest>;

    before(async () => {
        request = supertest('http://localhost:3000');
    });

    describe('POST /api/marketplace/list', () => {
        it('should list an NFT', async () => {
            const payload = {
                tokenId: 0,
                price: '1.0',
                address: process.env.NEXT_PUBLIC_WALLET_ADDRESS_SELLER,
            };

            const response = await request
                .post('/api/marketplace/list')
                .set('Content-Type', 'application/json')
                .send(payload);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('listingId').that.is.a('string');
            expect(response.body).to.have.property('transactionHash').that.matches(/^0x[a-fA-F0-9]{64}$/);
        });
    });

    describe('POST /api/marketplace/buy', () => {
        it('should buy an NFT', async () => {
            const payload = {
                listingId: 0,
                address: process.env.NEXT_PUBLIC_WALLET_ADDRESS_BUYER,
                price: '1.0',
            };

            const response = await request
                .post('/api/marketplace/buy')
                .set('Content-Type', 'application/json')
                .send(payload);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('listingId').that.is.a('string');
            expect(response.body).to.have.property('tokenId').that.is.a('string');
            expect(response.body).to.have.property('transactionHash').that.matches(/^0x[a-fA-F0-9]{64}$/);
        });
    });

    describe('GET /api/marketplace/search', () => {
        it('should search by tokenId', async () => {
            const response = await request.get('/api/marketplace/search?tokenId=0');

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('tokenId', '0');
            expect(response.body).to.have.property('isListed').that.is.a('boolean');
        });
    });
});