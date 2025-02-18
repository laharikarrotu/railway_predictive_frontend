export const exportToExcel = async (predictions) => {
  const { saveAs } = await import('file-saver');
  const XLSX = await import('xlsx');

  const ws = XLSX.utils.json_to_sheet(predictions.map(p => ({
    Timestamp: new Date(p.timestamp).toLocaleString(),
    Temperature: p.temperature,
    Vibration: p.vibration,
    Pressure: p.pressure,
    RPM: p.rpm,
    'Failure Risk (%)': (p.probability * 100).toFixed(1),
    Prediction: p.prediction === 1 ? 'Failure Predicted' : 'Normal Operation',
    'Confidence (%)': (p.confidence * 100).toFixed(1)
  })));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Predictions');
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(data, `railway-predictions-${new Date().toISOString()}.xlsx`);
};

export const exportToPDF = async (predictions) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable')
  ]);
  
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text('Railway Predictive Maintenance Report', 14, 15);
  
  const tableData = predictions.map(p => [
    new Date(p.timestamp).toLocaleString(),
    p.temperature,
    p.vibration,
    p.pressure,
    p.rpm,
    `${(p.probability * 100).toFixed(1)}%`,
    p.prediction === 1 ? 'Failure' : 'Normal',
    `${(p.confidence * 100).toFixed(1)}%`
  ]);

  autoTable(doc, {
    head: [['Timestamp', 'Temp (°C)', 'Vib (mm/s)', 'Press (bar)', 'RPM', 'Risk', 'Status', 'Conf.']],
    body: tableData,
    startY: 25
  });

  doc.save(`railway-report-${new Date().toISOString()}.pdf`);
}; 