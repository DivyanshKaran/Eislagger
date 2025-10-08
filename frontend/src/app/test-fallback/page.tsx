import NetworkFallbackTest from '@/components/test/NetworkFallbackTest';

export default function TestFallbackPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Network Fallback Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test the API fallback system that serves mock data when the backend is unreachable
          </p>
        </div>
        <NetworkFallbackTest />
      </div>
    </div>
  );
}
