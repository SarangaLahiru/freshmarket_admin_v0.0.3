'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface CategoryData {
  category: string;
  products: number;
  sales: number;
  revenue: number;
}

interface CategoryPerformanceChartProps {
  data: CategoryData[];
}

export function CategoryPerformanceChart({ data }: CategoryPerformanceChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="category" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Legend />
          <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
          <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}