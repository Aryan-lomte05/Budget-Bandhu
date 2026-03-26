export function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateAmount(amount: string): boolean {
    return /^\d+(\.\d{1,2})?$/.test(amount);
}
