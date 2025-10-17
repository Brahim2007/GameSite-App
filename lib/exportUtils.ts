import * as XLSX from 'xlsx';
import { DailySummary } from './types';
import { formatCurrency, formatTime } from './utils';

// Export Daily Report to PDF using Print
export const exportDailyReportToPDF = (summary: DailySummary, businessName: string, currency: string = 'ريال') => {
  // Use browser's print to PDF feature for better Arabic support
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) {
    alert('يرجى السماح بالنوافذ المنبثقة لتصدير PDF');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>التقرير اليومي - ${summary.date}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        @page { margin: 15mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'IBM Plex Sans Arabic', Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.4;
          color: #000;
        }
        h1 {
          text-align: center;
          font-size: 20pt;
          margin-bottom: 10px;
          color: #0284c7;
        }
        h2 {
          text-align: center;
          font-size: 14pt;
          margin-bottom: 5px;
        }
        .date {
          text-align: center;
          margin-bottom: 15px;
          color: #666;
        }
        .summary {
          background: #f0f9ff;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin: 5px 0;
          font-weight: 600;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: right;
        }
        th {
          background-color: #0284c7;
          color: white;
          font-weight: bold;
        }
        tfoot {
          background: linear-gradient(to right, rgba(191, 219, 254, 0.5), rgba(167, 243, 208, 0.5), rgba(221, 214, 254, 0.5));
          font-weight: bold;
        }
        tfoot td {
          padding: 12px 8px;
          font-size: 12pt;
          border-top: 3px solid #0284c7;
        }
        .amount {
          color: #059669;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h1>${businessName}</h1>
      <h2>التقرير اليومي</h2>
      <div class="date">التاريخ: ${summary.date}</div>
      
      <div class="summary">
        <div class="summary-item">
          <span>إجمالي الزبائن:</span>
          <span>${summary.totalCustomers.toLocaleString('en-US')}</span>
        </div>
        <div class="summary-item">
          <span>إجمالي المبلغ:</span>
          <span class="amount">${summary.totalAmount.toLocaleString('en-US')} ${currency}</span>
        </div>
        <div class="summary-item">
          <span>عدد العمليات:</span>
          <span>${summary.numberOfTransactions}</span>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>رقم الوصل</th>
            <th>الوقت</th>
            <th>الزبائن</th>
            <th>السعر</th>
            <th>المبلغ</th>
            <th>الموظف</th>
          </tr>
        </thead>
        <tbody>
          ${summary.entries.map((entry: any) => `
            <tr>
              <td>#${entry.serialNumber.toString().padStart(4, '0')}</td>
              <td>${formatTime(entry.date)}</td>
              <td>${entry.numberOfCustomers}</td>
              <td>${entry.pricePerPerson.toLocaleString('en-US')} ${currency}</td>
              <td class="amount">${entry.totalAmount.toLocaleString('en-US')} ${currency}</td>
              <td>${entry.user?.name || 'غير معروف'}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2">المجموع الكلي</td>
            <td>${summary.totalCustomers}</td>
            <td>-</td>
            <td class="amount">${summary.totalAmount.toLocaleString('en-US')} ${currency}</td>
            <td>${summary.numberOfTransactions} عملية</td>
          </tr>
        </tfoot>
      </table>
      
      <script>
        window.onload = function() {
          setTimeout(() => window.print(), 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

// Export Daily Report to Excel
export const exportDailyReportToExcel = (summary: DailySummary) => {
  const data = summary.entries.map((entry: any) => ({
    'رقم الوصل': `#${entry.serialNumber.toString().padStart(4, '0')}`,
    'الوقت': formatTime(entry.date),
    'عدد الزبائن': entry.numberOfCustomers,
    'السعر الفردي': entry.pricePerPerson,
    'المبلغ الإجمالي': entry.totalAmount,
    'الموظف': entry.user?.name || 'غير معروف',
  }));
  
  // Add summary row
  data.push({
    'رقم الوصل': '',
    'الوقت': 'المجموع',
    'عدد الزبائن': summary.totalCustomers,
    'السعر الفردي': '',
    'المبلغ الإجمالي': summary.totalAmount,
    'الموظف': `${summary.numberOfTransactions} عملية`,
  } as any);
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Daily Report');
  
  XLSX.writeFile(wb, `daily-report-${summary.date}.xlsx`);
};

// Export Monthly Report to PDF using Print
export const exportMonthlyReportToPDF = (
  dailySummaries: DailySummary[], 
  month: string, 
  year: number,
  businessName: string,
  currency: string = 'ريال'
) => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) {
    alert('يرجى السماح بالنوافذ المنبثقة لتصدير PDF');
    return;
  }

  const totalCustomers = dailySummaries.reduce((sum, d) => sum + d.totalCustomers, 0);
  const totalAmount = dailySummaries.reduce((sum, d) => sum + d.totalAmount, 0);
  const totalTransactions = dailySummaries.reduce((sum, d) => sum + d.numberOfTransactions, 0);

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>التقرير الشهري - ${month} ${year}</title>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        @page { margin: 15mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'IBM Plex Sans Arabic', Arial, sans-serif;
          font-size: 11pt;
          color: #000;
        }
        h1 {
          text-align: center;
          font-size: 20pt;
          margin-bottom: 10px;
          color: #0284c7;
        }
        h2 {
          text-align: center;
          font-size: 14pt;
          margin-bottom: 15px;
        }
        .summary {
          background: #f0f9ff;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin: 5px 0;
          font-weight: 600;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: right;
        }
        th {
          background-color: #0284c7;
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
        tfoot {
          background: linear-gradient(to right, rgba(191, 219, 254, 0.5), rgba(167, 243, 208, 0.5), rgba(221, 214, 254, 0.5));
        }
        tfoot td {
          padding: 12px 10px;
          font-size: 12pt;
          font-weight: bold;
          border-top: 3px solid #0284c7;
        }
        .amount { color: #059669; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>${businessName}</h1>
      <h2>التقرير الشهري - ${month} ${year}</h2>
      
      <div class="summary">
        <div class="summary-item">
          <span>إجمالي الزبائن:</span>
          <span>${totalCustomers.toLocaleString('en-US')}</span>
        </div>
        <div class="summary-item">
          <span>إجمالي المبلغ:</span>
          <span class="amount">${totalAmount.toLocaleString('en-US')} ${currency}</span>
        </div>
        <div class="summary-item">
          <span>عدد الأيام:</span>
          <span>${dailySummaries.filter(d => d.totalCustomers > 0).length}</span>
        </div>
        <div class="summary-item">
          <span>إجمالي العمليات:</span>
          <span>${totalTransactions}</span>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>التاريخ</th>
            <th>عدد الزبائن</th>
            <th>المبلغ الإجمالي</th>
            <th>عدد العمليات</th>
          </tr>
        </thead>
        <tbody>
          ${dailySummaries.filter(d => d.totalCustomers > 0).map(summary => `
            <tr>
              <td>${summary.date}</td>
              <td>${summary.totalCustomers.toLocaleString('en-US')}</td>
              <td class="amount">${summary.totalAmount.toLocaleString('en-US')} ${currency}</td>
              <td>${summary.numberOfTransactions}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td>المجموع الكلي</td>
            <td>${totalCustomers.toLocaleString('en-US')}</td>
            <td class="amount">${totalAmount.toLocaleString('en-US')} ${currency}</td>
            <td>${totalTransactions}</td>
          </tr>
        </tfoot>
      </table>
      
      <script>
        window.onload = function() {
          setTimeout(() => window.print(), 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

// Export Monthly Report to Excel
export const exportMonthlyReportToExcel = (
  dailySummaries: DailySummary[], 
  month: string, 
  year: number
) => {
  const data = dailySummaries.map(summary => ({
    'التاريخ': summary.date,
    'عدد الزبائن': summary.totalCustomers,
    'المبلغ الإجمالي': summary.totalAmount,
    'عدد العمليات': summary.numberOfTransactions,
  }));
  
  // Add summary row
  const totalCustomers = dailySummaries.reduce((sum, d) => sum + d.totalCustomers, 0);
  const totalAmount = dailySummaries.reduce((sum, d) => sum + d.totalAmount, 0);
  const totalTransactions = dailySummaries.reduce((sum, d) => sum + d.numberOfTransactions, 0);
  
  data.push({
    'التاريخ': 'المجموع الكلي',
    'عدد الزبائن': totalCustomers,
    'المبلغ الإجمالي': totalAmount,
    'عدد العمليات': totalTransactions,
  });
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Monthly Report');
  
  XLSX.writeFile(wb, `monthly-report-${month}-${year}.xlsx`);
};

