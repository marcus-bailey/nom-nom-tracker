import React, { useState, useEffect, MouseEvent } from 'react';
import { format, subDays } from 'date-fns';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { analyticsAPI } from '../api';
import { RangeSummary } from '../types';
import './Analytics.css';

type TimeRange = 'week' | 'month' | '3months';

interface ChartDataPoint {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MacroDistribution {
  name: string;
  value: number;
}

const COLORS: Record<string, string> = {
  protein: '#4CAF50',
  carbs: '#2196F3',
  fat: '#FF9800',
};

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [data, setData] = useState<RangeSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      const endDate = new Date();
      let startDate: Date;

      switch (timeRange) {
        case 'week':
          startDate = subDays(endDate, 7);
          break;
        case 'month':
          startDate = subDays(endDate, 30);
          break;
        case '3months':
          startDate = subDays(endDate, 90);
          break;
        default:
          startDate = subDays(endDate, 7);
      }

      const response = await analyticsAPI.getRangeSummary(
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd')
      );

      setData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!data || data.daily_data.length === 0) {
    return (
      <div className="analytics">
        <div className="card">
          <div className="card-header">
            <h2>Analytics & Trends</h2>
          </div>
          <p className="no-data">No data available for the selected time range. Start logging your meals to see analytics!</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const dailyChartData: ChartDataPoint[] = data.daily_data.map((day: any) => ({
    date: format(new Date(day.date), 'MMM d'),
    calories: parseFloat(day.calories),
    protein: parseFloat(day.protein),
    carbs: parseFloat(day.net_carbs),
    fat: parseFloat(day.fat),
  }));

  // Average macro percentages for pie chart
  const avgMacros: MacroDistribution[] = [
    { 
      name: 'Protein', 
      value: parseFloat(
        (data.daily_data.reduce((sum: number, day: any) => sum + parseFloat(day.protein_percentage), 0) / data.daily_data.length).toFixed(1)
      ) 
    },
    { 
      name: 'Carbs', 
      value: parseFloat(
        (data.daily_data.reduce((sum: number, day: any) => sum + parseFloat(day.carbs_percentage), 0) / data.daily_data.length).toFixed(1)
      ) 
    },
    { 
      name: 'Fat', 
      value: parseFloat(
        (data.daily_data.reduce((sum: number, day: any) => sum + parseFloat(day.fat_percentage), 0) / data.daily_data.length).toFixed(1)
      ) 
    },
  ];

  return (
    <div className="analytics">
      <div className="card">
        <div className="card-header">
          <h2>Analytics & Trends</h2>
          <div className="time-range-selector">
            <button
              className={timeRange === 'week' ? 'primary' : 'outline'}
              onClick={() => setTimeRange('week')}
            >
              Last 7 Days
            </button>
            <button
              className={timeRange === 'month' ? 'primary' : 'outline'}
              onClick={() => setTimeRange('month')}
            >
              Last 30 Days
            </button>
            <button
              className={timeRange === '3months' ? 'primary' : 'outline'}
              onClick={() => setTimeRange('3months')}
            >
              Last 90 Days
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="analytics-summary">
          <h3>Period Summary ({data.start_date} to {data.end_date})</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Avg Daily Calories</h3>
              <div className="value">{parseFloat(data.averages.calories).toFixed(0)}</div>
              <div className="label">Total: {parseFloat(data.totals.calories).toFixed(0)}</div>
            </div>
            <div className="stat-card">
              <h3>Avg Protein</h3>
              <div className="value">{parseFloat(data.averages.protein).toFixed(0)}g</div>
              <div className="label">Total: {parseFloat(data.totals.protein).toFixed(0)}g</div>
            </div>
            <div className="stat-card">
              <h3>Avg Net Carbs</h3>
              <div className="value">{parseFloat(data.averages.net_carbs).toFixed(0)}g</div>
              <div className="label">Total: {parseFloat(data.totals.net_carbs).toFixed(0)}g</div>
            </div>
            <div className="stat-card">
              <h3>Avg Fat</h3>
              <div className="value">{parseFloat(data.averages.fat).toFixed(0)}g</div>
              <div className="label">Total: {parseFloat(data.totals.fat).toFixed(0)}g</div>
            </div>
          </div>
        </div>

        {/* Calories Trend */}
        <div className="chart-section">
          <h3>Daily Calorie Intake</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="calories" stroke="#667eea" strokeWidth={2} name="Calories" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Macros Trend */}
        <div className="chart-section">
          <h3>Daily Macronutrient Intake (grams)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="protein" stroke={COLORS.protein} strokeWidth={2} name="Protein (g)" />
              <Line type="monotone" dataKey="carbs" stroke={COLORS.carbs} strokeWidth={2} name="Net Carbs (g)" />
              <Line type="monotone" dataKey="fat" stroke={COLORS.fat} strokeWidth={2} name="Fat (g)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Macros Bar Chart */}
        <div className="chart-section">
          <h3>Daily Macronutrient Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="protein" fill={COLORS.protein} name="Protein (g)" />
              <Bar dataKey="carbs" fill={COLORS.carbs} name="Net Carbs (g)" />
              <Bar dataKey="fat" fill={COLORS.fat} name="Fat (g)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Average Macro Distribution */}
        <div className="chart-section">
          <h3>Average Macro Distribution (by calories)</h3>
          <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={avgMacros}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }: MacroDistribution) => `${name}: ${value.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {avgMacros.map((entry: MacroDistribution, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase()]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
