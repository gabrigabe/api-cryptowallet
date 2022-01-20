import { Test, TestingModule } from '@nestjs/testing';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';

describe('WalletsController', () => {
    let controller: WalletsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WalletsController],
            providers: [WalletsService]
        }).compile();

        controller = module.get<WalletsController>(WalletsController);
    });

    it('should be able to create a new Wallet', () => {
        const newWallet = {
            name: 'fulano da silva',
            cpf: '732.221.438-20',
            birthdate: '05/01/2000'
        };
        const aaaa = controller.create(newWallet);
        console.log(aaaa);
    });
});
