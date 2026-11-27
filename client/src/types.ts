export type User = {
    id: number;
    name: string;
    email: string;
};

export type AuthResponse = {
    user: User;
    token: string;
};

export type TransactionType = "INCOME" | "EXPENSE";
export type Currency = "DOP" | "USD";

export type Category = {
    id: number;
    name: string;
    color: string;
    createdAt: string;
    userId: number;
};

export type NewCategory = {
    name: string;
    color: string;
};

export type TransactionCategory = Pick<Category, "id" | "name" | "color">;

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
    categoryId: number | null;
    category: TransactionCategory | null;
};

export type NewTransaction = {
    type: TransactionType;
    amount: number;
    currency: Currency;
    description: string;
    date: string;
    categoryId: number | null;
};

export type Budget = {
    id: number;
    amount: string;
    currency: Currency;
    createdAt: string;
    userId: number;
    categoryId: number;
    category: TransactionCategory;
    spent: string;
};

export type NewBudget = {
    categoryId: number;
    amount: number;
    currency: Currency;
};