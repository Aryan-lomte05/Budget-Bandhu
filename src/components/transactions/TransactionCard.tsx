"use client";

import { CategoryBadge } from "./CategoryBadge";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface Transaction {
    id: string;
    merchant: string;
    amount: number;
    category: string;
    type: 'debit' | 'credit';
    isAnomaly: boolean;
}

interface TransactionCardProps {
    transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
    return (
        <div className="glass p-4 rounded-xl border-2 border-white/50 hover:shadow-lg transition-all duration-200 cursor-pointer">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🏪</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{transaction.merchant}</h4>
                            {transaction.isAnomaly && (
                                <AlertCircle className="w-4 h-4 text-coral-500" />
                            )}
                        </div>
                        <CategoryBadge category={transaction.category} />
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-lg font-bold ${transaction.type === 'credit' ? 'text-mint-600' : 'text-gray-900'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                </div>
            </div>
        </div>
    );
}
