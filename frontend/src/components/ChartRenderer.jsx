import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartRenderer = ({ jsonData, xAxisKey, yAxisKey, chartType }) => {
  const chartRef = useRef(null);

  // Process data for chart
  const processChartData = () => {
    if (!jsonData || !xAxisKey || !yAxisKey) {
      return null;
    }

    const labels = jsonData.map(row => {
      const value = row[xAxisKey];
      return typeof value === 'number' ? value.toString() : value;
    });

    const data = jsonData.map(row => {
      const value = row[yAxisKey];
      return typeof value === 'number' ? value : parseFloat(value) || 0;
    });

    return { labels, data };
  };

  // Generate chart configuration based on type
  const getChartConfig = () => {
    const chartData = processChartData();
    if (!chartData) return null;

    const baseConfig = {
      labels: chartData.labels,
      datasets: [
        {
          label: yAxisKey,
          data: chartData.data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: false,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart: ${xAxisKey} vs ${yAxisKey}`,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: xAxisKey,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: yAxisKey,
          },
        },
      },
    };

    switch (chartType) {
      case 'line':
        return {
          data: {
            ...baseConfig,
            datasets: [{
              ...baseConfig.datasets[0],
              fill: true,
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
            }],
          },
          options,
        };

      case 'bar':
        return {
          data: {
            ...baseConfig,
            datasets: [{
              ...baseConfig.datasets[0],
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1,
            }],
          },
          options,
        };

      case 'pie':
        return {
          data: {
            labels: chartData.labels,
            datasets: [{
              data: chartData.data,
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(139, 92, 246, 0.8)',
                'rgba(236, 72, 153, 0.8)',
                'rgba(14, 165, 233, 0.8)',
                'rgba(34, 197, 94, 0.8)',
              ],
              borderWidth: 2,
              borderColor: '#ffffff',
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
              },
              title: {
                display: true,
                text: `${xAxisKey} Distribution`,
              },
            },
          },
        };

      case 'scatter':
        return {
          data: {
            datasets: [{
              label: `${xAxisKey} vs ${yAxisKey}`,
              data: chartData.labels.map((label, index) => ({
                x: parseFloat(label) || index,
                y: chartData.data[index],
              })),
              backgroundColor: 'rgba(59, 130, 246, 0.6)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1,
              pointRadius: 6,
              pointHoverRadius: 8,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: `Scatter Plot: ${xAxisKey} vs ${yAxisKey}`,
              },
            },
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                title: {
                  display: true,
                  text: xAxisKey,
                },
              },
              y: {
                title: {
                  display: true,
                  text: yAxisKey,
                },
              },
            },
          },
        };

      default:
        return null;
    }
  };

  const chartConfig = getChartConfig();

  if (!chartConfig) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Chart Visualization</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>Please select data columns to generate a chart.</p>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    const { data, options } = chartConfig;

    switch (chartType) {
      case 'line':
        return <Line ref={chartRef} data={data} options={options} />;
      case 'bar':
        return <Bar ref={chartRef} data={data} options={options} />;
      case 'pie':
        return <Pie ref={chartRef} data={data} options={options} />;
      case 'scatter':
        return <Scatter ref={chartRef} data={data} options={options} />;
      default:
        return <Line ref={chartRef} data={data} options={options} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Chart Visualization</h3>
      
      {/* Chart Container */}
      <div className="relative h-96 w-full">
        {renderChart()}
      </div>

      {/* Chart Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Chart Type:</span>
            <p className="text-gray-600 capitalize">{chartType}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">X-Axis:</span>
            <p className="text-gray-600">{xAxisKey}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Y-Axis:</span>
            <p className="text-gray-600">{yAxisKey}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Data Points:</span>
            <p className="text-gray-600">{jsonData?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartRenderer; 