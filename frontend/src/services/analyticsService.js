import api from '../utils/api';

export const analyticsService = {
  /**
   * Get analytics data for a specific upload
   */
  async getAnalytics(uploadId) {
    try {
      const response = await api.get(`/analytics/${uploadId}`);
      return response.data;
    } catch (error) {
      console.error('Get Analytics API Error:', error);
      throw error;
    }
  },

  /**
   * Get analytics overview for all user uploads
   */
  async getAnalyticsOverview() {
    try {
      const response = await api.get('/analytics/overview');
      return response.data;
    } catch (error) {
      console.error('Get Analytics Overview API Error:', error);
      throw error;
    }
  },

  /**
   * Get AI insights for a specific upload
   */
  async getInsights(uploadId) {
    try {
      const response = await api.get(`/analytics/${uploadId}/insights`);
      return response.data;
    } catch (error) {
      console.error('Get Insights API Error:', error);
      throw error;
    }
  },

  /**
   * Get data quality metrics for a specific upload
   */
  async getDataQuality(uploadId) {
    try {
      const response = await api.get(`/analytics/${uploadId}/quality`);
      return response.data;
    } catch (error) {
      console.error('Get Data Quality API Error:', error);
      throw error;
    }
  },

  /**
   * Regenerate analysis for an upload
   */
  async regenerateAnalysis(uploadId) {
    try {
      const response = await api.post(`/analytics/${uploadId}/regenerate`);
      return response.data;
    } catch (error) {
      console.error('Regenerate Analysis API Error:', error);
      throw error;
    }
  },

  /**
   * Local statistical calculations (fallback)
   */
  calculateBasicStats(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return null;
    }

    const numericColumns = {};
    const categoricalColumns = {};

    // Identify column types
    Object.keys(data[0]).forEach(column => {
      const values = data.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
      const numericValues = values.map(val => parseFloat(val)).filter(val => !isNaN(val));
      
      if (numericValues.length > 0) {
        numericColumns[column] = numericValues;
      } else {
        categoricalColumns[column] = values;
      }
    });

    // Calculate statistics for numeric columns
    const stats = {};
    Object.keys(numericColumns).forEach(column => {
      const values = numericColumns[column];
      const sorted = [...values].sort((a, b) => a - b);
      const sum = values.reduce((acc, val) => acc + val, 0);
      const mean = sum / values.length;
      const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
      
      stats[column] = {
        count: values.length,
        mean: Math.round(mean * 100) / 100,
        median: sorted[Math.floor(sorted.length / 2)],
        min: sorted[0],
        max: sorted[sorted.length - 1],
        standardDeviation: Math.round(Math.sqrt(variance) * 100) / 100
      };
    });

    return {
      numericStats: stats,
      numericColumns: Object.keys(numericColumns),
      categoricalColumns: Object.keys(categoricalColumns),
      totalRows: data.length,
      totalColumns: Object.keys(data[0]).length
    };
  },

  /**
   * Format analysis results for display
   */
  formatAnalysisResults(analysisData) {
    if (!analysisData || !analysisData.analysisResults) {
      return null;
    }

    const { analysisResults } = analysisData;
    
    return {
      summary: {
        totalRows: analysisData.metadata?.totalRows || 0,
        totalColumns: analysisData.metadata?.totalColumns || 0,
        dataQualityScore: analysisResults.dataQuality?.overall_score || 0,
        processingTime: analysisResults.metadata?.processingTime || 0
      },
      descriptiveStats: analysisResults.descriptiveStats,
      correlations: analysisResults.correlationMatrix,
      dataQuality: analysisResults.dataQuality,
      outliers: analysisResults.outliers || {},
      trends: analysisResults.trends || {},
      insights: analysisData.aiInsights?.insights || []
    };
  },

  /**
   * Get analysis status display text
   */
  getAnalysisStatusText(status) {
    const statusMap = {
      'pending': 'Analysis Pending',
      'processing': 'Analyzing Data...',
      'completed': 'Analysis Complete',
      'failed': 'Analysis Failed'
    };
    return statusMap[status] || 'Unknown Status';
  },

  /**
   * Get analysis status color
   */
  getAnalysisStatusColor(status) {
    const colorMap = {
      'pending': 'text-yellow-600',
      'processing': 'text-blue-600',
      'completed': 'text-green-600',
      'failed': 'text-red-600'
    };
    return colorMap[status] || 'text-gray-600';
  }
};

export default analyticsService;
