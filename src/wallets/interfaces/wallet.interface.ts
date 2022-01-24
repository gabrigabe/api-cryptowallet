export interface IWallet {
    address: string;
    name: string;
    cpf: string;
    birthdate: string;
    createdAt: Date;
    updatedAt: Date;

    coins: [
        {
            name: string;
            fullname: string;
            amount: number;
            transactions: [
                {
                    value: number;
                    datetime: Date;
                    sendTo: string;
                    receivefrom: string;
                    currentCotation: number;
                }
            ];
        }
    ];
}
