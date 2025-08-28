import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InsightsGenerator() {
  return (
    <Card className="rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-xl mb-6">
      <CardHeader>
        <CardTitle>Auto Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 text-sm text-muted-foreground">
          <li>
            &quot;Mango Tango sales dropped by 18% in South India vs. last 90
            days. Suggest seasonal replacement.&quot;
          </li>
          <li>
            &quot;Choco Fudge stockouts increased in 4 factories. Consider
            increasing production.&quot;
          </li>
          <li>&quot;Pune HQ is the top performing shop this month.&quot;</li>
        </ul>
      </CardContent>
    </Card>
  );
}
