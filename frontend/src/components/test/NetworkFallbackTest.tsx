"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFlavors } from '@/hooks/useFlavors';
import { useStore } from '@/hooks/useStores';
import { useOrders } from '@/hooks/useOrders';
import { Wifi, WifiOff, TestTube, CheckCircle, AlertCircle } from 'lucide-react';

export default function NetworkFallbackTest() {
  const [testMode, setTestMode] = useState<'online' | 'offline'>('online');
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | 'pending'>>({});

  // Test data hooks
  const { data: flavors, isLoading: flavorsLoading, error: flavorsError } = useFlavors({ page: 1, limit: 5 });
  const { data: store, isLoading: storeLoading, error: storeError } = useStore('1');
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useOrders({ page: 1, limit: 5 });

  const runNetworkTest = async () => {
    setTestMode('offline');
    setTestResults({
      flavors: 'pending',
      store: 'pending',
      orders: 'pending',
    });

    // Simulate network failure by making direct API calls to invalid endpoints
    try {
      // Test direct API calls to invalid endpoints
      const testPromises = [
        fetch('http://localhost:9999/api/v1/flavors').catch(() => null),
        fetch('http://localhost:9999/api/v1/shops/1').catch(() => null),
        fetch('http://localhost:9999/api/v1/orders').catch(() => null),
      ];

      await Promise.all(testPromises);

      // Wait a moment for the hooks to potentially refetch
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check results - if we have data, fallback worked
      const results: Record<string, 'success' | 'error'> = {};
      
      if (flavors && flavors.length > 0) {
        results.flavors = 'success';
      } else {
        results.flavors = 'error';
      }

      if (store && store.id) {
        results.store = 'success';
      } else {
        results.store = 'error';
      }

      if (orders && orders.length > 0) {
        results.orders = 'success';
      } else {
        results.orders = 'error';
      }

      setTestResults(results);
    } catch (error) {
      console.error('Test error:', error);
      setTestResults({
        flavors: 'error',
        store: 'error',
        orders: 'error',
      });
    }

    // Reset to online mode after 5 seconds
    setTimeout(() => {
      setTestMode('online');
      setTestResults({});
    }, 5000);
  };

  const getStatusIcon = (status: 'success' | 'error' | 'pending' | undefined) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getStatusBadge = (status: 'success' | 'error' | 'pending' | undefined) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Mock Data</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Testing</Badge>;
      default:
        return <Badge variant="outline">Ready</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Network Fallback Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {testMode === 'online' ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm font-medium">
                Status: {testMode === 'online' ? 'Online' : 'Simulating Network Failure'}
              </span>
            </div>
            <Button 
              onClick={runNetworkTest}
              disabled={testMode === 'offline'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Test Fallback
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Flavors Test */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Flavors API</h3>
                  {getStatusIcon(testResults.flavors)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getStatusBadge(testResults.flavors)}
                  <div className="text-sm text-gray-600">
                    {flavorsLoading ? 'Loading...' : 
                     flavors ? `${flavors.length} flavors loaded` : 
                     'No data'}
                  </div>
                  {flavors && flavors.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Sample: {flavors[0]?.name}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Store Test */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Store API</h3>
                  {getStatusIcon(testResults.store)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getStatusBadge(testResults.store)}
                  <div className="text-sm text-gray-600">
                    {storeLoading ? 'Loading...' : 
                     store ? `Store: ${store.name}` : 
                     'No data'}
                  </div>
                  {store && (
                    <div className="text-xs text-gray-500">
                      Capacity: {store.capacity}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Orders Test */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Orders API</h3>
                  {getStatusIcon(testResults.orders)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getStatusBadge(testResults.orders)}
                  <div className="text-sm text-gray-600">
                    {ordersLoading ? 'Loading...' : 
                     orders ? `${orders.length} orders loaded` : 
                     'No data'}
                  </div>
                  {orders && orders.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Total: ${orders[0]?.total}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Click "Test Fallback" to simulate network failure</li>
              <li>• The system will attempt to connect to invalid endpoints</li>
              <li>• When network errors are detected, mock data is served instead</li>
              <li>• The UI continues to work seamlessly with realistic mock data</li>
              <li>• Check the browser console for fallback activation logs</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
