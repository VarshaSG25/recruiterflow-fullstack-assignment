import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/index.js';
import { 
  deleteExpense, 
  setCategoryFilter, 
  clearNotification, 
  resetToSampleData 
} from '../store/expensesSlice.js';
import { calculateBalances, computeSettlements } from '../logic/balance.js';
import { formatPaiseToRupees } from '../logic/money.js';
import { describeSplit } from '../logic/split.js';
import { ExpenseCategory, Expense } from '../logic/types.js';
import { 
  Trash2, 
  Plus, 
  Filter, 
  ArrowRight, 
  CheckCircle, 
  RotateCcw, 
  AlertCircle, 
  X,
  CreditCard,
  Users
} from 'lucide-react';

const CATEGORIES: (ExpenseCategory | 'All')[] = [
  'All',
  'Food',
  'Travel',
  'Stay',
  'Activities',
  'Other',
];

export const ExpensesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { members, expenses, selectedCategory, notification } = useAppSelector(state => state.trip);

  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [showSettlementModal, setShowSettlementModal] = useState(false);

  // Calculate balances using pure logic outside component
  const balances = useMemo(() => {
    return calculateBalances(members, expenses);
  }, [members, expenses]);

  // Compute optimal settlement transactions
  const settlements = useMemo(() => {
    return computeSettlements(members, balances);
  }, [members, balances]);

  // Verify net sum invariant
  const totalNetPaise = useMemo(() => {
    return balances.reduce((sum, b) => sum + b.netPaise, 0);
  }, [balances]);

  // Member map for quick lookup
  const memberNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const m of members) {
      map[m.id] = m.name;
    }
    return map;
  }, [members]);

  // Filter expenses and sort newest date first
  const filteredExpenses = useMemo(() => {
    let list = [...expenses];
    if (selectedCategory !== 'All') {
      list = list.filter(e => e.category === selectedCategory);
    }
    // Sort newest date first
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [expenses, selectedCategory]);

  // Total of expenses currently shown
  const currentTotalPaise = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const confirmDelete = () => {
    if (expenseToDelete) {
      dispatch(deleteExpense(expenseToDelete.id));
      setExpenseToDelete(null);
    }
  };

  const getCategoryBadgeClass = (category: ExpenseCategory) => {
    switch (category) {
      case 'Food':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Travel':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Stay':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Activities':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div 
          role="status"
          aria-live="polite"
          className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium">{notification}</p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(clearNotification())}
            className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-700"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Trip Expenses
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tracking shared expenses and net balances for Goa trip members
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSettlementModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all"
          >
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <span>Settle Up</span>
          </button>

          <Link
            to="/expenses/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add expense</span>
          </Link>
        </div>
      </div>

      {/* Member Balances Cards */}
      <section aria-labelledby="balances-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            <h2 id="balances-heading" className="text-base font-bold text-slate-800">
              Member Balances
            </h2>
          </div>
          <div className="text-xs font-medium text-slate-500">
            Net balance sum: <span className="font-semibold text-slate-700">{formatPaiseToRupees(totalNetPaise)}</span>
            {totalNetPaise === 0 && <span className="text-emerald-600 ml-1">✓ Balanced</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {balances.map(b => {
            const isGetsBack = b.status === 'gets_back';
            const isOwes = b.status === 'owes';

            return (
              <div
                key={b.memberId}
                className={`p-4 rounded-2xl border transition-all ${
                  isGetsBack
                    ? 'bg-emerald-50/70 border-emerald-200 shadow-2xs'
                    : isOwes
                    ? 'bg-rose-50/70 border-rose-200 shadow-2xs'
                    : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-sm">{b.name}</span>
                  <span
                    className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      isGetsBack
                        ? 'bg-emerald-100 text-emerald-800'
                        : isOwes
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isGetsBack ? 'credit' : isOwes ? 'debt' : 'settled'}
                  </span>
                </div>
                <div
                  className={`text-base font-extrabold tracking-tight ${
                    isGetsBack
                      ? 'text-emerald-700'
                      : isOwes
                      ? 'text-rose-700'
                      : 'text-slate-600'
                  }`}
                >
                  {b.statusText}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                  <span>Paid: {formatPaiseToRupees(b.paidPaise)}</span>
                  <span>Share: {formatPaiseToRupees(b.owedPaise)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filter & Total Summary Toolbar */}
      <section className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Category filter pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1.5 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => dispatch(setCategoryFilter(cat))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Total & sample reset */}
          <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">Total shown</div>
              <div className="text-xl font-extrabold text-slate-900 tracking-tight">
                {formatPaiseToRupees(currentTotalPaise)}
              </div>
            </div>

            <button
              type="button"
              onClick={() => dispatch(resetToSampleData())}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Reset data back to original Goa trip sample"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset sample</span>
            </button>
          </div>
        </div>

        {/* Expenses Table or Empty State */}
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-16 px-4 border border-dashed border-slate-200 rounded-xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No expenses found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {selectedCategory !== 'All'
                ? `There are no recorded expenses in the "${selectedCategory}" category.`
                : 'No expenses have been added yet for this trip.'}
            </p>
            <div className="mt-5">
              <Link
                to="/expenses/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add first expense</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4">Date</th>
                    <th scope="col" className="py-3 px-4">Description</th>
                    <th scope="col" className="py-3 px-4">Category</th>
                    <th scope="col" className="py-3 px-4">Paid by</th>
                    <th scope="col" className="py-3 px-4 text-right">Amount</th>
                    <th scope="col" className="py-3 px-4">Split</th>
                    <th scope="col" className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredExpenses.map(expense => (
                    <tr
                      key={expense.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-mono text-xs">
                        {expense.date}
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {expense.description}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getCategoryBadgeClass(
                            expense.category
                          )}`}
                        >
                          {expense.category}
                        </span>
                      </td>

                      {/* Paid by */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-medium text-slate-800">
                          {memberNameMap[expense.paidBy] || expense.paidBy}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right font-extrabold text-slate-900 font-mono">
                        {formatPaiseToRupees(expense.amount)}
                      </td>

                      {/* Split info */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 text-xs">
                        {describeSplit(expense.split, members)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={() => setExpenseToDelete(expense)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title={`Delete ${expense.description}`}
                          aria-label={`Delete ${expense.description}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      {expenseToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 id="delete-modal-title" className="text-base font-bold text-slate-900">
                  Delete Expense?
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Are you sure you want to delete &ldquo;
                  <span className="font-semibold">{expenseToDelete.description}</span>
                  &rdquo; ({formatPaiseToRupees(expenseToDelete.amount)})?
                  All member balances will update immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setExpenseToDelete(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition-colors"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settle Up / Direct Debts Modal */}
      {showSettlementModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settle-modal-title"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="settle-modal-title" className="text-base font-bold text-slate-900">
                    Debt Simplification & Settlements
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fewest payments needed to completely square up the group
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSettlementModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close settlement modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {settlements.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-900">Everyone is all settled up!</p>
                <p className="text-xs text-slate-500 mt-0.5">No outstanding debts remain.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {settlements.map((s, idx) => (
                  <div
                    key={`${s.fromId}-${s.toId}-${idx}`}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{s.fromName}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <span className="font-bold text-slate-900">{s.toName}</span>
                    </div>
                    <div className="font-extrabold text-indigo-700 font-mono text-base">
                      {formatPaiseToRupees(s.amountPaise)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSettlementModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
