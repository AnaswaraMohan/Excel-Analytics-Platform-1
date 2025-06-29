import React, { useEffect, useRef, useState } from 'react';
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaDownload, FaFilePdf, FaFileImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { saveChart, markChartExported } from '../services/chartService';
import { exportChartAsPNG, exportChartAsPDF, generateChartFilename } from '../utils/chartExport';
import ChartThemeToggle from './ChartThemeToggle';

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

const ChartRenderer = ({ jsonData, xAxisKey, yAxisKey, chartType, uploadId }) => {
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Save chart metadata when chart configuration changes
  const saveChartMetadata = async () => {
    if (uploadId && xAxisKey && yAxisKey && chartType) {
      try {
        await saveChart({
          uploadId,
          chartType,
          xAxisKey,
          yAxisKey,
          chartConfig: {
            timestamp: new Date().toISOString(),
            dataPoints: jsonData?.length || 0
          }
        });
      } catch (error) {
        console.log('Chart metadata save failed (optional):', error);
      }
    }
  };

  // Auto-save chart metadata when configuration changes
  useEffect(() => {
    if (xAxisKey && yAxisKey && chartType && uploadId) {
      saveChartMetadata();
    }
  }, [xAxisKey, yAxisKey, chartType, uploadId]);

  // Export chart as PNG
  const exportAsPNG = async () => {
    if (chartRef.current) {
      const chartInstance = chartRef.current;
      const canvas = chartInstance.canvas;
      const filename = generateChartFilename(chartType, xAxisKey, yAxisKey);
      
      exportChartAsPNG(canvas, filename);
      toast.success('Chart exported as PNG successfully!');
      
      // Mark as exported (optional)
      try {
        await saveChartMetadata();
      } catch (error) {
        console.log('Export tracking failed (optional):', error);
      }
    }
  };

  // Export chart as PDF
  const exportAsPDF = async () => {
    if (chartContainerRef.current) {
      try {
        const filename = generateChartFilename(chartType, xAxisKey, yAxisKey);
        await exportChartAsPDF(chartContainerRef.current, filename);
        
        toast.success('Chart exported as PDF successfully!');
        
        // Mark as exported (optional)
        try {
          await saveChartMetadata();
        } catch (error) {
          console.log('Export tracking failed (optional):', error);
        }
      } catch (error) {
        console.error('Error exporting PDF:', error);
        toast.error('Failed to export PDF');
      }
    }
  };

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

  // Generate chart configuration based on type and theme
  const getChartConfig = () => {
    const chartData = processChartData();
    if (!chartData) return null;

    // Theme colors
    const theme = isDarkTheme ? {
      primary: 'rgb(96, 165, 250)', // blue-400
      primaryBg: 'rgba(96, 165, 250, 0.1)',
      gridColor: 'rgba(255, 255, 255, 0.1)',
      textColor: '#ffffff',
      backgroundColor: '#1f2937', // gray-800
    } : {
      primary: 'rgb(59, 130, 246)', // blue-600
      primaryBg: 'rgba(59, 130, 246, 0.1)',
      gridColor: 'rgba(0, 0, 0, 0.1)',
      textColor: '#374151', // gray-700
      backgroundColor: '#ffffff',
    };

    const baseConfig = {
      labels: chartData.labels,
      datasets: [
        {
          label: yAxisKey,
          data: chartData.data,
          borderColor: theme.primary,
          backgroundColor: theme.primaryBg,
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
          labels: {
            color: theme.textColor,
          },
        },
        title: {
          display: true,
          text: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart: ${xAxisKey} vs ${yAxisKey}`,
          color: theme.textColor,
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
            color: theme.textColor,
          },
          ticks: {
            color: theme.textColor,
          },
          grid: {
            color: theme.gridColor,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: yAxisKey,
            color: theme.textColor,
          },
          ticks: {
            color: theme.textColor,
          },
          grid: {
            color: theme.gridColor,
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
              backgroundColor: theme.primaryBg,
              borderColor: theme.primary,
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
              backgroundColor: theme.primary.replace('rgb', 'rgba').replace(')', ', 0.8)'),
              borderColor: theme.primary,
              borderWidth: 1,
            }],
          },
          options,
        };

      case 'pie':
        const pieColors = isDarkTheme ? [
          'rgba(96, 165, 250, 0.8)', // blue-400
          'rgba(34, 197, 94, 0.8)',  // green-500
          'rgba(251, 191, 36, 0.8)', // amber-400
          'rgba(248, 113, 113, 0.8)', // red-400
          'rgba(168, 85, 247, 0.8)', // purple-400
          'rgba(236, 72, 153, 0.8)', // pink-400
          'rgba(6, 182, 212, 0.8)',  // cyan-500
          'rgba(52, 211, 153, 0.8)', // emerald-400
        ] : [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ];

        return {
          data: {
            labels: chartData.labels,
            datasets: [{
              data: chartData.data,
              backgroundColor: pieColors,
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
                labels: {
                  color: theme.textColor,
                },
              },
              title: {
                display: true,
                text: `${xAxisKey} Distribution`,
                color: theme.textColor,
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
              backgroundColor: theme.primary.replace('rgb', 'rgba').replace(')', ', 0.6)'),
              borderColor: theme.primary,
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
                labels: {
                  color: theme.textColor,
                },
              },
              title: {
                display: true,
                text: `Scatter Plot: ${xAxisKey} vs ${yAxisKey}`,
                color: theme.textColor,
              },
            },
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                title: {
                  display: true,
                  text: xAxisKey,
                  color: theme.textColor,
                },
                ticks: {
                  color: theme.textColor,
                },
                grid: {
                  color: theme.gridColor,
                },
              },
              y: {
                title: {
                  display: true,
                  text: yAxisKey,
                  color: theme.textColor,
                },
                ticks: {
                  color: theme.textColor,
                },
                grid: {
                  color: theme.gridColor,
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
    <div className={`rounded-lg shadow-md p-6 ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`} ref={chartContainerRef}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
          Chart Visualization
        </h3>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ChartThemeToggle 
            isDarkTheme={isDarkTheme} 
            onThemeChange={setIsDarkTheme} 
          />
          
          {/* Export Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={exportAsPNG}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Export as PNG"
            >
              <FaFileImage className="mr-1" />
              PNG
            </button>
            <button
              onClick={exportAsPDF}
              className="flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title="Export as PDF"
            >
              <FaFilePdf className="mr-1" />
              PDF
            </button>
          </div>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="relative h-96 w-full">
        {renderChart()}
      </div>

      {/* Chart Info */}
      <div className={`mt-4 p-3 rounded-lg ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className={`font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Chart Type:</span>
            <p className={`capitalize ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>{chartType}</p>
          </div>
          <div>
            <span className={`font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>X-Axis:</span>
            <p className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>{xAxisKey}</p>
          </div>
          <div>
            <span className={`font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Y-Axis:</span>
            <p className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>{yAxisKey}</p>
          </div>
          <div>
            <span className={`font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Data Points:</span>
            <p className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>{jsonData?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartRenderer; 