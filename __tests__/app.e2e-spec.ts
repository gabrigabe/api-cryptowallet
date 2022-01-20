import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../src/app/app.module';



describe('AppController (e2e)', () => {
    let app: INestApplication;
    let request: any;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        request = supertest(app)
    });

    it('/ (GET)', () => request(app.getHttpServer()).get('/').expect(200).expect('Hello World!'));
});
