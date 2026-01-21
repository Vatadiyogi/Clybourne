// backend/src/utils/EjsRenderer.js
const ejs = require('ejs');
const fs = require('fs').promises;
const path = require('path');

class EjsRenderer {
  constructor() {
    this.templateCache = null;
  }
  
  async loadTemplate() {
    if (this.templateCache) return this.templateCache;
    
    const templatePath = path.join(__dirname, '../templates/valuation-report.ejs');
    this.templateCache = await fs.readFile(templatePath, 'utf-8');
    return this.templateCache;
  }
  
  async render(data) {
    try {
      const template = await this.loadTemplate();
      
      // Helper functions for EJS template
      const helpers = {
        formatNumber: (num) => {
          if (typeof num !== 'number') return num;
          return num.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
        },
        formatCurrency: (num, currency = 'INR') => {
          if (typeof num !== 'number') return `${currency} 0`;
          if (num >= 1000000) {
            return `${currency} ${(num / 1000000).toFixed(2)}M`;
          }
          if (num >= 1000) {
            return `${currency} ${(num / 1000).toFixed(2)}K`;
          }
          return `${currency} ${num.toFixed(2)}`;
        },
        formatPercent: (num) => {
          if (typeof num !== 'number') return '0%';
          return `${num.toFixed(1)}%`;
        }
      };
      
      // Merge helpers with data
      const templateData = {
        ...data,
        ...helpers
      };
      
      // Render EJS template
      const html = ejs.render(template, templateData);
      return html;
      
    } catch (error) {
      console.error('EJS Render Error:', error);
      throw error;
    }
  }
}

module.exports = new EjsRenderer();