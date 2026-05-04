"use client";

import { createFinanceCommitment, createFinanceWallet, deleteFinanceCommitment, deleteFinanceWallet } from "@/actions/finance-entries";
import { formatCurrency } from "@/lib/format";
import type { FinanceCommitment, FinanceWallet } from "@/types/section-data";

type WalletSummary = FinanceWallet & {
  spent: number;
  funded: number;
  available: number;
  progress: number;
};

type FinanceWalletsPanelProps = {
  locale: "en" | "vi";
  wallets: WalletSummary[];
  commitments: FinanceCommitment[];
};

const walletPills: Record<string, string> = {
  blue: "bg-[#DCEEF6] text-[#05386B]",
  green: "bg-[#D9F6E5] text-[#20555F]",
  amber: "bg-amber-100 text-amber-700",
  violet: "bg-violet-100 text-violet-700",
  red: "bg-rose-100 text-rose-700",
};

export function FinanceWalletsPanel({
  locale,
  wallets,
  commitments,
}: FinanceWalletsPanelProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
      <div className="space-y-4">
        <form action={createFinanceWallet} className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
          <p className="text-sm font-semibold text-[#05386B]">{locale === "vi" ? "Ví dự án / ngân sách" : "Project wallets / budgets"}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="title" placeholder={locale === "vi" ? "Tên ví" : "Wallet name"} required />
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" min="0" name="budgetAmount" placeholder={locale === "vi" ? "Ngân sách" : "Budget"} type="number" required />
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="startDate" type="date" />
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="endDate" type="date" />
            <select className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="color">
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="amber">Amber</option>
              <option value="violet">Violet</option>
              <option value="red">Red</option>
            </select>
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="description" placeholder={locale === "vi" ? "Mô tả ví" : "Wallet description"} />
          </div>
          <button className="mt-4 rounded-2xl bg-[#05386B] px-4 py-2 text-sm font-medium text-[#EDF5E1]" type="submit">
            {locale === "vi" ? "Tạo ví" : "Create wallet"}
          </button>
        </form>

        <div className="space-y-3">
          {wallets.length ? (
            wallets.map((wallet) => (
              <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-5 shadow-sm" key={wallet.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${walletPills[wallet.color] ?? walletPills.blue}`}>
                      {wallet.title}
                    </span>
                    <p className="mt-3 text-sm text-[#20555F]">{wallet.description || (locale === "vi" ? "Không có mô tả." : "No description.")}</p>
                  </div>
                  <form action={deleteFinanceWallet}>
                    <input name="id" type="hidden" value={wallet.id} />
                    <button className="text-xs font-medium text-rose-700" type="submit">
                      {locale === "vi" ? "Xoá" : "Delete"}
                    </button>
                  </form>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#D8E9E0]">
                  <div className="h-full rounded-full bg-[#05386B]" style={{ width: `${Math.min(wallet.progress, 100)}%` }} />
                </div>
                <div className="mt-3 grid gap-2 text-sm text-[#20555F] md:grid-cols-3">
                  <p>{locale === "vi" ? "Ngân sách" : "Budget"}: <span className="font-semibold text-[#05386B]">{formatCurrency(Number(wallet.budget_amount))}</span></p>
                  <p>{locale === "vi" ? "Đã chi" : "Spent"}: <span className="font-semibold text-[#05386B]">{formatCurrency(wallet.spent)}</span></p>
                  <p>{locale === "vi" ? "Còn lại" : "Available"}: <span className="font-semibold text-[#05386B]">{formatCurrency(wallet.available)}</span></p>
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-[2rem] border border-dashed border-[#8EE4AF] bg-[#F7FBF4] p-5 text-sm text-[#20555F]">
              {locale === "vi" ? "Chưa có ví nào. Hãy tạo một quỹ cho dự án, chuyến đi, hoặc chiến dịch." : "No wallets yet. Create one for a project, trip, or campaign."}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <form action={createFinanceCommitment} className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
          <p className="text-sm font-semibold text-[#05386B]">{locale === "vi" ? "Dòng tiền sắp tới" : "Upcoming cashflow item"}</p>
          <div className="mt-4 grid gap-3">
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="title" placeholder={locale === "vi" ? "Ví dụ: lương, hosting, vé máy bay" : "Ex: salary, hosting, flights"} required />
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" min="0" name="amount" type="number" required />
            <select className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="commitmentType">
              <option value="expense">{locale === "vi" ? "Khoản chi" : "Expense"}</option>
              <option value="income">{locale === "vi" ? "Khoản thu" : "Income"}</option>
            </select>
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="dueDate" type="date" required />
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="category" placeholder={locale === "vi" ? "Danh mục" : "Category"} />
            <select className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="walletId">
              <option value="">{locale === "vi" ? "Không gắn ví" : "No wallet"}</option>
              {wallets.map((wallet) => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.title}
                </option>
              ))}
            </select>
          </div>
          <button className="mt-4 rounded-2xl bg-[#05386B] px-4 py-2 text-sm font-medium text-[#EDF5E1]" type="submit">
            {locale === "vi" ? "Lưu dự báo" : "Save projection item"}
          </button>
        </form>

        <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
          <p className="text-sm font-semibold text-[#05386B]">{locale === "vi" ? "Các khoản sắp tới" : "Upcoming commitments"}</p>
          <div className="mt-4 space-y-3">
            {commitments.length ? (
              commitments.map((commitment) => (
                <div className="flex items-center justify-between rounded-[1.5rem] bg-[#F7FBF4] px-4 py-3" key={commitment.id}>
                  <div>
                    <p className="font-medium text-[#05386B]">{commitment.title}</p>
                    <p className="text-xs text-[#379683]">
                      {commitment.due_date} · {commitment.category} · {commitment.commitment_type}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#05386B]">{formatCurrency(Number(commitment.amount))}</span>
                    <form action={deleteFinanceCommitment}>
                      <input name="id" type="hidden" value={commitment.id} />
                      <button className="text-xs font-medium text-rose-700" type="submit">
                        {locale === "vi" ? "Xoá" : "Delete"}
                      </button>
                    </form>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-[1.5rem] border border-dashed border-[#8EE4AF] bg-[#F7FBF4] p-4 text-sm text-[#20555F]">
                {locale === "vi" ? "Chưa có khoản thu/chi nào được dự báo cho tháng này." : "No scheduled income or bills in this month yet."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
