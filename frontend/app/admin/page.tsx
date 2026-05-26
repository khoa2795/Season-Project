"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminRequest } from "@/lib/admin/auth";

type DashboardResponse = {
  summary: {
    totalOrders: number;
    activeCustomers: number;
    pendingOrders: number;
    grossRevenue: number;
    deliveredRevenue: number;
    unitsSold: number;
    lowStockProducts: number;
  };
  revenueTrend: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    unitsSold: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    placedAt?: string;
  }>;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    void (async () => {
      try {
        const response = await adminRequest<DashboardResponse>({
          url: "/admin/dashboard",
          method: "GET",
        });

        if (isCancelled === false) {
          setData(response);
          setErrorMessage(null);
        }
      } catch (error) {
        if (isCancelled === false) {
          setErrorMessage(
            error instanceof Error ? error.message : "Failed to load dashboard",
          );
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <AdminGuard>
      {(user) => (
        <AdminShell user={user}>
          <div className="space-y-8">
            <div className="max-w-2xl space-y-3">
              <p className="font-afacad text-sm uppercase tracking-[0.3em] text-black/45">
                Dashboard
              </p>
              <h1 className="font-serif text-4xl">Business snapshot</h1>
              <p className="max-w-xl text-sm leading-6 text-black/55">
                Live overview of orders, revenue recognition, sales volume and stock risk from the current MongoDB data.
              </p>
            </div>

            {errorMessage !== null ? (
              <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {errorMessage}
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Gross Revenue",
                  value: formatCurrency(data?.summary.grossRevenue ?? 0),
                },
                {
                  label: "Delivered Revenue",
                  value: formatCurrency(data?.summary.deliveredRevenue ?? 0),
                },
                {
                  label: "Total Orders",
                  value: String(data?.summary.totalOrders ?? 0),
                },
                {
                  label: "Units Sold",
                  value: String(data?.summary.unitsSold ?? 0),
                },
                {
                  label: "Pending Orders",
                  value: String(data?.summary.pendingOrders ?? 0),
                },
                {
                  label: "Active Customers",
                  value: String(data?.summary.activeCustomers ?? 0),
                },
                {
                  label: "Low Stock Products",
                  value: String(data?.summary.lowStockProducts ?? 0),
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[1.75rem] border border-black/8 bg-[#faf8f4] p-5"
                >
                  <p className="font-afacad text-xs uppercase tracking-[0.25em] text-black/45">
                    {metric.label}
                  </p>
                  <p className="mt-4 font-serif text-3xl">{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <section className="rounded-[2rem] border border-black/8 bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-afacad text-xs uppercase tracking-[0.25em] text-black/45">
                      Revenue Trend
                    </p>
                    <h2 className="mt-2 font-serif text-2xl">Last months</h2>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  {(data?.revenueTrend ?? []).map((point) => {
                    const maxRevenue = Math.max(
                      ...(data?.revenueTrend.map((item) => item.revenue) ?? [1]),
                    );
                    const width = maxRevenue === 0 ? 0 : (point.revenue / maxRevenue) * 100;

                    return (
                      <div key={point.month}>
                        <div className="mb-2 flex items-center justify-between gap-4 text-sm text-black/60">
                          <span>{point.month}</span>
                          <span>{formatCurrency(point.revenue)}</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-[#ece6dc]">
                          <div
                            className="h-full rounded-full bg-[#d7b58b]"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-[2rem] border border-black/8 bg-[#121212] p-6 text-white">
                <p className="font-afacad text-xs uppercase tracking-[0.25em] text-white/45">
                  Top Products
                </p>
                <h2 className="mt-2 font-serif text-2xl">Best sellers</h2>
                <div className="mt-6 space-y-4">
                  {(data?.topProducts ?? []).map((product) => (
                    <div
                      key={product.productId}
                      className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"
                    >
                      <p className="font-serif text-lg">{product.productName}</p>
                      <p className="mt-2 text-sm text-white/55">
                        {product.unitsSold} units sold
                      </p>
                      <p className="mt-1 text-sm text-[#d7b58b]">
                        {formatCurrency(product.revenue)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section className="rounded-[2rem] border border-black/8 bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-afacad text-xs uppercase tracking-[0.25em] text-black/45">
                    Recent Orders
                  </p>
                  <h2 className="mt-2 font-serif text-2xl">Latest activity</h2>
                </div>
              </div>
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-black/45">
                    <tr>
                      <th className="pb-3 font-afacad uppercase tracking-[0.16em]">Customer</th>
                      <th className="pb-3 font-afacad uppercase tracking-[0.16em]">Total</th>
                      <th className="pb-3 font-afacad uppercase tracking-[0.16em]">Status</th>
                      <th className="pb-3 font-afacad uppercase tracking-[0.16em]">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.recentOrders ?? []).map((order) => (
                      <tr key={order.id} className="border-t border-black/6">
                        <td className="py-4">
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-black/45">{order.customerEmail}</p>
                        </td>
                        <td className="py-4">{formatCurrency(order.totalAmount)}</td>
                        <td className="py-4 uppercase text-black/65">{order.status}</td>
                        <td className="py-4 uppercase text-black/65">{order.paymentStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </AdminShell>
      )}
    </AdminGuard>
  );
}
