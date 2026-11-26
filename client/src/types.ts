export type User = {
    id: number;
    name: string;
    email: string;
};

export type AuthResponse = {
    user: User;
    token: string;
}

export type TransactionType = "INCOME" | "EXPENSE";
export type Currency = "DOP" | "USD";

export type Transaction = {
    id: number;
    type: TransactionType;
    amount: string;
    currency: Currency;
    description: string;
    date: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
};

export type NewTransaction = {
    type: TransactionType;
    amount: number;
    currency: Currency;
    description: string;
    date: string;
};