import apiRequest from '../utils/api.js';

const API_BASE = '/api/reports';

const reportsService = {
  // Generate a new AI-powered report
  async generateReport(uploadId, reportType = 'comprehensive', customPrompt = '') {
    try {
      const response = await apiRequest(`${API_BASE}/generate`, {
        method: 'POST',
        body: JSON.stringify({
          uploadId,
          reportType,
          customPrompt
        })
      });
      return response;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },

  // Get all reports for current user
  async getUserReports() {
    try {
      const response = await apiRequest(`${API_BASE}/user`);
      return response;
    } catch (error) {
      console.error('Error fetching user reports:', error);
      throw error;
    }
  },

  // Get specific report by ID
  async getReport(reportId) {
    try {
      const response = await apiRequest(`${API_BASE}/${reportId}`);
      return response;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  },

  // Update/edit a report
  async updateReport(reportId, updates) {
    try {
      const response = await apiRequest(`${API_BASE}/${reportId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return response;
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  },

  // Delete a report
  async deleteReport(reportId) {
    try {
      const response = await apiRequest(`${API_BASE}/${reportId}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  },

  // Export report as text
  async exportReportTxt(reportId) {
    try {
      const response = await fetch(`/api/reports/${reportId}/export/txt`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to export report as text');
      }
      
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error exporting report as text:', error);
      throw error;
    }
  },

  // Export report as PDF
  async exportReportPdf(reportId) {
    try {
      const response = await fetch(`/api/reports/${reportId}/export/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to export report as PDF');
      }
      
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error exporting report as PDF:', error);
      throw error;
    }
  },

  // Get available report templates
  async getTemplates() {
    try {
      const response = await apiRequest(`${API_BASE}/templates`);
      return response;
    } catch (error) {
      console.error('Error fetching report templates:', error);
      throw error;
    }
  },

  // Regenerate report with new parameters
  async regenerateReport(reportId, newParams = {}) {
    try {
      const response = await apiRequest(`${API_BASE}/${reportId}/regenerate`, {
        method: 'POST',
        body: JSON.stringify(newParams)
      });
      return response;
    } catch (error) {
      console.error('Error regenerating report:', error);
      throw error;
    }
  }
};

// Named exports for individual functions
export const generateReport = reportsService.generateReport;
export const getUserReports = reportsService.getUserReports;
export const getReport = reportsService.getReport;
export const updateReport = reportsService.updateReport;
export const deleteReport = reportsService.deleteReport;
export const exportReportTxt = reportsService.exportReportTxt;
export const exportReportPdf = reportsService.exportReportPdf;
export const getTemplates = reportsService.getTemplates;
export const regenerateReport = reportsService.regenerateReport;

// Default export
export default reportsService;
