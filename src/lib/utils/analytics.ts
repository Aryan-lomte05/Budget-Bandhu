export function calculateSavingsRate(income: number, expenses: number): number {
    return ((income - expenses) / income) * 100;
}
