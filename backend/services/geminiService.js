const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-pro',
      generationConfig: {
        temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      }
    });
    
    this.isEnabled = !!process.env.GOOGLE_GEMINI_API_KEY;
  }

  /**
   * Generate comprehensive data insights using Gemini
   */
  async generateDataInsights(analysisResults, metadata = {}) {
    if (!this.isEnabled) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const prompt = this.buildInsightsPrompt(analysisResults, metadata);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return this.parseInsightsResponse(response.text());
    } catch (error) {
      console.error('Gemini insights generation error:', error);
      throw error;
    }
  }

  /**
   * Generate comprehensive business reports using Gemini
   */
  async generateBusinessReport(analysisResults, metadata = {}, template = 'detailed') {
    if (!this.isEnabled) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const prompt = this.buildReportPrompt(analysisResults, metadata, template);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return this.parseReportResponse(response.text(), template);
    } catch (error) {
      console.error('Gemini report generation error:', error);
      throw error;
    }
  }

  /**
   * Build comprehensive insights prompt for Gemini
   */
  buildInsightsPrompt(analysisResults, metadata) {
    const { descriptiveStats, correlationMatrix, dataQuality, outliers, trends } = analysisResults;
    
    return `
You are a senior data scientist and business analyst. Analyze this comprehensive dataset and provide actionable business insights.

DATASET OVERVIEW:
- Rows: ${metadata.rowCount || 'Unknown'}
- Columns: ${metadata.columnCount || 'Unknown'}
- Data Quality Score: ${dataQuality?.overall_score || 'Unknown'}%
- Processing Time: ${metadata.processingTime || 'Unknown'}ms

STATISTICAL ANALYSIS:
${this.formatDescriptiveStats(descriptiveStats)}

CORRELATION INSIGHTS:
${this.formatCorrelationMatrix(correlationMatrix)}

DATA QUALITY ASSESSMENT:
- Completeness: ${dataQuality?.completeness || 'Unknown'}%
- Uniqueness: ${dataQuality?.uniqueness || 'Unknown'}%
- Validity: ${dataQuality?.validity || 'Unknown'}%
- Consistency: ${dataQuality?.consistency || 'Unknown'}%

OUTLIER PATTERNS:
${this.formatOutliers(outliers)}

TREND ANALYSIS:
${this.formatTrends(trends)}

Please provide:
1. **Key Business Insights**: 5-7 critical findings that impact business decisions
2. **Data Quality Assessment**: Specific recommendations for data improvement
3. **Pattern Recognition**: Significant correlations and their business implications
4. **Risk Indicators**: Potential issues identified in the data
5. **Opportunity Areas**: Areas where the data suggests growth or optimization potential
6. **Actionable Recommendations**: Specific next steps based on the analysis

Format your response as structured insights with confidence levels and business impact assessments.
    `.trim();
  }

  /**
   * Build comprehensive report prompt for Gemini
   */
  buildReportPrompt(analysisResults, metadata, template) {
    const basePrompt = this.buildInsightsPrompt(analysisResults, metadata);
    
    const templateSpecs = {
      executive: {
        audience: 'C-level executives and senior management',
        focus: 'High-level strategic insights, ROI implications, and executive decisions',
        sections: ['Executive Summary', 'Key Performance Indicators', 'Strategic Recommendations', 'Risk Assessment'],
        tone: 'Professional, concise, strategic'
      },
      detailed: {
        audience: 'Data analysts, managers, and technical stakeholders',
        focus: 'Comprehensive analysis with technical details and methodologies',
        sections: ['Executive Summary', 'Methodology', 'Detailed Findings', 'Statistical Analysis', 'Recommendations', 'Appendices'],
        tone: 'Technical, thorough, analytical'
      },
      operational: {
        audience: 'Operations teams and middle management',
        focus: 'Process improvements, efficiency metrics, and operational insights',
        sections: ['Operational Overview', 'Process Analysis', 'Efficiency Metrics', 'Improvement Opportunities'],
        tone: 'Practical, action-oriented, clear'
      },
      financial: {
        audience: 'Finance teams and budget decision makers',
        focus: 'Cost analysis, financial impact, and budget implications',
        sections: ['Financial Overview', 'Cost Analysis', 'Budget Impact', 'Financial Recommendations'],
        tone: 'Precise, quantitative, business-focused'
      }
    };

    const spec = templateSpecs[template] || templateSpecs.detailed;

    return `
${basePrompt}

REPORT SPECIFICATIONS:
- Template: ${template.toUpperCase()}
- Target Audience: ${spec.audience}
- Primary Focus: ${spec.focus}
- Required Sections: ${spec.sections.join(', ')}
- Writing Tone: ${spec.tone}

Please generate a comprehensive ${template} report with the following structure:

${spec.sections.map((section, index) => `${index + 1}. **${section}**`).join('\n')}

FORMATTING REQUIREMENTS:
- Use clear headings and subheadings
- Include bullet points for key findings
- Add executive summary at the beginning
- Provide specific, quantifiable insights where possible
- Include confidence levels for predictions
- Add actionable recommendations with priority levels
- Use professional business language appropriate for the target audience
- Include data visualizations descriptions where relevant
- Ensure the report is comprehensive yet readable

The report should be approximately 2000-3000 words and provide substantial value for business decision-making.
    `.trim();
  }

  /**
   * Parse insights response from Gemini
   */
  parseInsightsResponse(responseText) {
    const insights = [];
    
    try {
      // Extract different types of insights using pattern matching
      const sections = {
        'Key Business Insights': /(?:Key Business Insights|Business Insights)[:\s]*(.*?)(?=\n\n|\n[A-Z]|$)/s,
        'Data Quality Assessment': /(?:Data Quality Assessment|Quality Assessment)[:\s]*(.*?)(?=\n\n|\n[A-Z]|$)/s,
        'Pattern Recognition': /(?:Pattern Recognition|Patterns)[:\s]*(.*?)(?=\n\n|\n[A-Z]|$)/s,
        'Risk Indicators': /(?:Risk Indicators|Risks)[:\s]*(.*?)(?=\n\n|\n[A-Z]|$)/s,
        'Opportunity Areas': /(?:Opportunity Areas|Opportunities)[:\s]*(.*?)(?=\n\n|\n[A-Z]|$)/s,
        'Actionable Recommendations': /(?:Actionable Recommendations|Recommendations)[:\s]*(.*?)(?=\n\n|\n[A-Z]|$)/s
      };

      Object.entries(sections).forEach(([category, pattern]) => {
        const match = responseText.match(pattern);
        if (match && match[1]) {
          const content = match[1].trim();
          insights.push({
            category: category.toLowerCase().replace(/\s+/g, '_'),
            finding: content,
            confidence: this.extractConfidence(content),
            priority: this.extractPriority(content),
            impact: this.extractImpact(content)
          });
        }
      });

      return {
        insights,
        fullResponse: responseText,
        generatedAt: new Date(),
        model: 'gemini-pro'
      };
    } catch (error) {
      console.error('Error parsing insights response:', error);
      return {
        insights: [{
          category: 'general',
          finding: responseText,
          confidence: 0.8,
          priority: 'medium',
          impact: 'moderate'
        }],
        fullResponse: responseText,
        generatedAt: new Date(),
        model: 'gemini-pro'
      };
    }
  }

  /**
   * Parse report response from Gemini
   */
  parseReportResponse(responseText, template) {
    try {
      // Extract sections based on common patterns
      const sections = this.extractReportSections(responseText);
      
      return {
        title: `${template.charAt(0).toUpperCase() + template.slice(1)} Data Analysis Report`,
        template,
        sections,
        fullContent: responseText,
        metadata: {
          wordCount: responseText.split(/\s+/).length,
          generatedAt: new Date(),
          model: 'gemini-pro',
          template,
          estimatedReadingTime: Math.ceil(responseText.split(/\s+/).length / 200) // ~200 words/min
        }
      };
    } catch (error) {
      console.error('Error parsing report response:', error);
      return {
        title: `Data Analysis Report`,
        template,
        sections: [{
          title: 'Analysis Report',
          content: responseText,
          order: 1
        }],
        fullContent: responseText,
        metadata: {
          wordCount: responseText.split(/\s+/).length,
          generatedAt: new Date(),
          model: 'gemini-pro',
          template
        }
      };
    }
  }

  /**
   * Extract report sections from response text
   */
  extractReportSections(text) {
    const sections = [];
    
    // Common section patterns
    const sectionPatterns = [
      /(?:^|\n)(?:#+\s*)?(Executive Summary|EXECUTIVE SUMMARY)[:\s]*(.*?)(?=\n(?:#+\s*)?[A-Z][^a-z\n]+[:\s]|$)/s,
      /(?:^|\n)(?:#+\s*)?(Key Findings|KEY FINDINGS)[:\s]*(.*?)(?=\n(?:#+\s*)?[A-Z][^a-z\n]+[:\s]|$)/s,
      /(?:^|\n)(?:#+\s*)?(Methodology|METHODOLOGY)[:\s]*(.*?)(?=\n(?:#+\s*)?[A-Z][^a-z\n]+[:\s]|$)/s,
      /(?:^|\n)(?:#+\s*)?(Detailed Findings|DETAILED FINDINGS|Analysis|ANALYSIS)[:\s]*(.*?)(?=\n(?:#+\s*)?[A-Z][^a-z\n]+[:\s]|$)/s,
      /(?:^|\n)(?:#+\s*)?(Recommendations|RECOMMENDATIONS)[:\s]*(.*?)(?=\n(?:#+\s*)?[A-Z][^a-z\n]+[:\s]|$)/s,
      /(?:^|\n)(?:#+\s*)?(Conclusion|CONCLUSION)[:\s]*(.*?)(?=\n(?:#+\s*)?[A-Z][^a-z\n]+[:\s]|$)/s,
      /(?:^|\n)(?:#+\s*)?(Risk Assessment|RISK ASSESSMENT)[:\s]*(.*?)(?=\n(?:#+\s*)?[A-Z][^a-z\n]+[:\s]|$)/s
    ];

    sectionPatterns.forEach((pattern, index) => {
      const match = text.match(pattern);
      if (match && match[1] && match[2]) {
        sections.push({
          title: match[1].trim(),
          content: match[2].trim(),
          order: index + 1,
          type: 'analysis'
        });
      }
    });

    // If no sections found, create a single section
    if (sections.length === 0) {
      sections.push({
        title: 'Analysis Report',
        content: text,
        order: 1,
        type: 'general'
      });
    }

    return sections.sort((a, b) => a.order - b.order);
  }

  /**
   * Helper methods for formatting data
   */
  formatDescriptiveStats(stats) {
    if (!stats?.columns) return 'No statistical data available';
    
    return stats.columns.map(col => 
      `- ${col.name} (${col.type}): ${col.count} values, ${col.nullCount} missing`
    ).join('\n');
  }

  formatCorrelationMatrix(matrix) {
    if (!matrix || Object.keys(matrix).length === 0) return 'No correlation data available';
    
    const correlations = [];
    Object.keys(matrix).forEach(col1 => {
      Object.keys(matrix[col1]).forEach(col2 => {
        if (col1 !== col2 && Math.abs(matrix[col1][col2]) > 0.5) {
          correlations.push(`${col1} ↔ ${col2}: ${(matrix[col1][col2] * 100).toFixed(1)}%`);
        }
      });
    });
    
    return correlations.length > 0 ? correlations.join('\n') : 'No significant correlations found';
  }

  formatOutliers(outliers) {
    if (!outliers || outliers.length === 0) return 'No significant outliers detected';
    
    return outliers.map(outlier => 
      `- ${outlier.column}: ${outlier.count} outliers (${outlier.percentage}%) using ${outlier.method}`
    ).join('\n');
  }

  formatTrends(trends) {
    if (!trends || trends.length === 0) return 'No trend data available';
    
    return trends.map(trend => 
      `- ${trend.column}: ${trend.direction} trend (strength: ${trend.strength})`
    ).join('\n');
  }

  extractConfidence(text) {
    const confidenceMatch = text.match(/confidence[:\s]*(\d+)%/i);
    return confidenceMatch ? parseInt(confidenceMatch[1]) / 100 : 0.8;
  }

  extractPriority(text) {
    if (/high|critical|urgent/i.test(text)) return 'high';
    if (/low|minor/i.test(text)) return 'low';
    return 'medium';
  }

  extractImpact(text) {
    if (/significant|major|substantial/i.test(text)) return 'high';
    if (/minor|small|limited/i.test(text)) return 'low';
    return 'moderate';
  }

  /**
   * Test Gemini connection
   */
  async testConnection() {
    try {
      const result = await this.model.generateContent('Hello, this is a connection test. Please respond with "Connection successful".');
      const response = await result.response;
      return {
        success: true,
        message: response.text(),
        model: 'gemini-pro'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = GeminiService;
