import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import nunjucks from 'nunjucks';
import { DateTime } from 'luxon';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const agendaFilePath = path.join(__dirname, '../_includes/agenda.html');
const templatePath = path.join(__dirname, '../_includes/agenda.njk');
const csvUrl = 'https://docs.google.com/spreadsheets/d/1fcTrcBVpO7xIfpzuX65_lzsMeD1SHmKPZAKzidOnLcw/export?format=csv&gid=644213694';

// Configure Nunjucks environment to include the _includes directory
const nunjucksEnv = new nunjucks.Environment(new nunjucks.FileSystemLoader(path.join(__dirname, '../_includes')));

// Add a custom date filter
nunjucksEnv.addFilter('date', (date, format) => {
  return DateTime.fromJSDate(date).toFormat(format);
});

// Add a custom `upper` filter to capitalize text
nunjucksEnv.addFilter('upper', (str) => {
  return str.toUpperCase();
});

export default async function generateAgenda() {
  try {
    const response = await fetch(csvUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    const rows = csvText.split('\n').map(row => row.split(','));
    const headers = rows.shift(); // Remove header row

    const today = new Date();
    const agenda = {};

    // Parse dates in DD/MM/YYYY format
    rows.forEach(row => {
      const [date, ...rest] = row;
      const [day, month, year] = date.split('/').map(Number);
      row[0] = new Date(year, month - 1, day); // Convert to a valid Date object
    });

    // Sort rows by the parsed date
    rows.sort((a, b) => a[0] - b[0]);

    // Process sorted rows into agenda structure
    rows.forEach(row => {
      const [date, day, weekNumber, event, details, format] = row;
      const eventDate = new Date(date);

      if (isNaN(eventDate) || eventDate < today) return; // Skip invalid or past dates

      const monthName = eventDate.toLocaleString('default', { month: 'long' });

      if (!agenda[monthName]) {
        agenda[monthName] = [];
      }

      agenda[monthName].push({
        date: eventDate,
        name: event,
        details,
        format,
      });
    });

    const agendaHtml = nunjucksEnv.render(templatePath, { agenda });
    fs.writeFileSync(agendaFilePath, agendaHtml, 'utf8');
    console.log('Agenda successfully generated.');
  } catch (error) {
    console.error('Error generating agenda:', error);
    fs.writeFileSync(agendaFilePath, '<p class="text-red-500">Failed to load agenda. Please try again later.</p>', 'utf8');
  }
}

generateAgenda();
