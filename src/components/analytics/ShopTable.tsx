import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShopTable() {
  return (
    <Card className="rounded-2xl bg-gradient-to-br from-pink-100/80 to-purple-100/80 dark:from-pink-900/30 dark:to-purple-900/30 shadow-xl border border-pink-200/60 dark:border-pink-800/40 backdrop-blur-xl p-8 mb-6">
      <CardHeader>
        <CardTitle>Shop-Level Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-2 py-1 text-left">Shop</th>
                <th className="px-2 py-1 text-left">Revenue</th>
                <th className="px-2 py-1 text-left">Orders</th>
                <th className="px-2 py-1 text-left">Avg Order</th>
                <th className="px-2 py-1 text-left">Top Flavor</th>
                <th className="px-2 py-1 text-left">Stockouts</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1">Eis Berlin</td>
                <td className="px-2 py-1">₹12.2K</td>
                <td className="px-2 py-1">313</td>
                <td className="px-2 py-1">₹39.05</td>
                <td className="px-2 py-1">Vanilla Jet</td>
                <td className="px-2 py-1">2</td>
              </tr>
              <tr>
                <td className="px-2 py-1">Pune HQ</td>
                <td className="px-2 py-1">₹9.8K</td>
                <td className="px-2 py-1">210</td>
                <td className="px-2 py-1">₹46.20</td>
                <td className="px-2 py-1">Mango Tango</td>
                <td className="px-2 py-1">0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
