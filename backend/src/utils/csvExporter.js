import { format } from 'fast-csv';

export const exportToCSV = (res, data, filename) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  
  const csvStream = format({ headers: true });
  csvStream.pipe(res);
  data.forEach(item => csvStream.write(item));
  csvStream.end();
}; 