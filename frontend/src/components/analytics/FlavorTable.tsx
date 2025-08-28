import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FlavorTable() {
  return (
    <Card className="rounded-2xl bg-gradient-to-br from-pink-100/80 to-purple-100/80 dark:from-pink-900/30 dark:to-purple-900/30 shadow-xl border border-pink-200/60 dark:border-pink-800/40 backdrop-blur-xl p-8 mb-6">
      <CardHeader>
        <CardTitle>Flavor-wise Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-2 py-1 text-left">Flavor</th>
                <th className="px-2 py-1 text-left">Units Sold</th>
                <th className="px-2 py-1 text-left">Regions Popular</th>
                <th className="px-2 py-1 text-left">Seasonal Index</th>
                <th className="px-2 py-1 text-left">Return %</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1">Strawberry Swirl</td>
                <td className="px-2 py-1">4,200</td>
                <td className="px-2 py-1">Berlin, Pune</td>
                <td className="px-2 py-1">85% Summer</td>
                <td className="px-2 py-1">0.5%</td>
              </tr>
              <tr>
                <td className="px-2 py-1">Mango Tango</td>
                <td className="px-2 py-1">5,800</td>
                <td className="px-2 py-1">Mumbai, Chennai</td>
                <td className="px-2 py-1">92% Summer</td>
                <td className="px-2 py-1">0.2%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
