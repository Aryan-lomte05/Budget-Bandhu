"use client";

import { TransactionCard } from "./TransactionCard";
import { formatRelativeTime } from "@/lib/utils";

interface Transaction {
    id: string;
    date: string;
    merchant: string;
    amount: number;
    category: string;
    type: 'debit' | 'credit';
    isAnomaly: boolean;
}

interface TransactionListProps {
    transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
    // Group transactions by date
    const groupedTransactions = transactions.reduce((acc, txn) => {
        const dateLabel = formatRelativeTime(txn.date);
        if (!acc[dateLabel]) {
            acc[dateLabel] = [];
        }
        acc[dateLabel].push(txn);
        return acc;
    }, {} as Record<string, Transaction[]>);

    return (
        <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([date, txns]) => (
                <div key={date}>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 sticky top-0 bg-gray-50 py-2 z-10">
                        {date}
                    </h3>
                    <div className="space-y-2">
                        {txns.map((txn) => (
                            <TransactionCard key={txn.id} transaction={txn} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
