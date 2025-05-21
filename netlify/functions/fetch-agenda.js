import nunjucks from 'nunjucks';
import { DateTime } from 'luxon';

const csvUrl = 'https://docs.google.com/spreadsheets/d/1fcTrcBVpO7xIfpzuX65_lzsMeD1SHmKPZAKzidOnLcw/export?format=csv&gid=644213694';

// Configure Nunjucks environment
const nunjucksEnv = new nunjucks.Environment();

// Add custom filters
nunjucksEnv.addFilter('date', (date, format) => {
  return DateTime.fromJSDate(date).toFormat(format);
});
nunjucksEnv.addFilter('upper', (str) => {
  return str.toUpperCase();
});

export async function handler() {
  try {
    const response = await fetch(csvUrl);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `Failed to fetch CSV: ${response.statusText}`,
      };
    }

    const csvText = await response.text();
    const rows = csvText.split('\n').map(row => row.split(','));
    rows.shift(); // Remove header row

    const today = new Date();
    const agenda = {};

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

    const agendaHtml = nunjucksEnv.renderString(`
      {% for month, events in agenda %}
      <div class="month mb-8">
        <h2 class="text-2xl font-bold mt-6">{{ month }}</h2>
        {% for event in events %}
        <div class="event flex items-top text-center w-full mb-8">
          <div class="flex flex-col items-center w-16 flex-shrink-0 self-start rounded-lg border border-gray-200 overflow-hidden">
            <div class="w-full text-white bg-red-500 font-bold text-sm py-0.5">{{ event.date | date("MMM") | upper }}</div>
            <div class="w-full bg-white text-black text-xl py-1">{{ event.date | date("d") }}</div>
          </div>
          <div class="ml-4 text-start">
            <div class="text-lg font-semibold">{{ event.name }}</div>
            <div class="text-sm text-gray-600">{{ event.details }}</div>
            <div class="text-sm text-gray-500 mt-2">
              {% if event.format and event.format.trim() != "" %}📌 {{ event.format }}{% endif %}
            </div>
          </div>
        </div>
        {% endfor %}
      </div>
      {% endfor %}
    `, { agenda });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: agendaHtml,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error fetching agenda: ${error.message}`,
    };
  }
}
