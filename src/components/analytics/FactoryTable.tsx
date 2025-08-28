import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FactoryTable() {
  return (
    <Card className="rounded-2xl bg-gradient-to-br from-pink-100/80 to-purple-100/80 dark:from-pink-900/30 dark:to-purple-900/30 shadow-xl border border-pink-200/60 dark:border-pink-800/40 backdrop-blur-xl p-8 mb-6">
      <CardHeader>
        <CardTitle>Factory Production Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-2 py-1 text-left">Factory</th>
                <th className="px-2 py-1 text-left">Produced Flavors</th>
                <th className="px-2 py-1 text-left">Units</th>
                <th className="px-2 py-1 text-left">Shift</th>
                <th className="px-2 py-1 text-left">Issues</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1">Mango Haus</td>
                <td className="px-2 py-1">Mango Tango, Aamlicious</td>
                <td className="px-2 py-1">8,230</td>
                <td className="px-2 py-1">Day/Night</td>
                <td className="px-2 py-1">None</td>
              </tr>
              <tr>
                <td className="px-2 py-1">Choco Works</td>
                <td className="px-2 py-1">Choco Fudge</td>
                <td className="px-2 py-1">5,100</td>
                <td className="px-2 py-1">Night</td>
                <td className="px-2 py-1">Maintenance</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
