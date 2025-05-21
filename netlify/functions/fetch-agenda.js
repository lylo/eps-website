import nunjucks from 'nunjucks';
import { DateTime } from 'luxon';

const csvUrl = 'https://docs.google.com/spreadsheets/d/1fcTrcBVpO7xIfpzuX65_lzsMeD1SHmKPZAKzidOnLcw/export?format=csv&gid=644213694';

// Configure Nunjucks
const nunjucksEnv = new nunjucks.Environment();
nunjucksEnv.addFilter('date', (date, format) => DateTime.fromJSDate(date).toFormat(format));
nunjucksEnv.addFilter('upper', str => str.toUpperCase());

// Attempt to parse the date, cleaning up known messy formats
function parseDate(raw) {
  if (!raw) return null;

  // Remove bracketed notes and ranges
  let cleaned = raw.split(' ')[0].split('-')[0].trim();

  const parsed = DateTime.fromFormat(cleaned, 'd/M/yyyy', { zone: 'utc' });
  return parsed.isValid ? parsed : null;
}

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
    const lines = csvText.split('\n').map(line => line.split(',').map(cell => cell.trim()));
    // Adjust filtering logic to ensure valid rows are processed
    const dataRows = lines.filter(row => row.length >= 4 && row[0] !== 'Date');

    const today = DateTime.now();
    const events = [];

    for (const row of dataRows) {
      const [rawDate, , , event, details, format] = row;
      const parsedDate = parseDate(rawDate);

      // Ensure parsedDate is valid and not in the past
      if (!parsedDate || parsedDate < today) {
        console.warn(`Skipping invalid or past event: ${row}`);
        continue;
      }

      events.push({
        date: parsedDate.toJSDate(),
        name: event,
        details,
        format,
      });
    }

    // Sort by date
    if (events.length === 0) {
      console.warn('No valid events found after filtering.');
    } else {
      console.log('Valid events:', events);
    }

    // Group by month name
    const agenda = {};
    for (const event of events) {
      const monthName = DateTime.fromJSDate(event.date).toFormat('LLLL');
      if (!agenda[monthName]) agenda[monthName] = [];
      agenda[monthName].push(event);
    }

    // Debugging: Log the structure of the agenda object
    console.log('Final Agenda Object:', JSON.stringify(agenda, null, 2));

    // Ensure agenda is not empty before rendering
    if (Object.keys(agenda).length === 0) {
      console.warn('Agenda is empty. No events to render.');
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/html',
        },
        body: '<p>No events available at this time.</p>',
      };
    }

    // Render the agenda HTML
    const agendaHtml = nunjucksEnv.renderString(`
      {% for month, events in agenda %}
        <div class="month mb-12">
          <h2 class="text-2xl font-bold mt-6">{{ month }} {{ events[0].date | date("yyyy") }}</h2>
          {% for event in events %}
            <div class="event flex items-top text-center w-full mb-8">
              <div class="flex flex-col items-center w-16 flex-shrink-0 self-start rounded-lg border border-gray-200 overflow-hidden">
                <div class="w-full text-white bg-red-500 font-bold text-sm py-0.5">{{ event.date | date("MMM") | upper }}</div>
                <div class="w-full bg-white text-black text-xl py-1">{{ event.date | date("d") }}</div>
              </div>
              <div class="ml-4 text-start">
                <div class="text-lg font-semibold">{{ event.name }}</div>
                <div class="text-sm text-gray-600">{{ event.details }}</div>
                {% if event.format %}
                  <div class="text-sm text-gray-500 mt-2">📌 {{ event.format }}</div>
                {% endif %}
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
        'Content-Type': 'text/html',
      },
      body: agendaHtml,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error generating agenda: ${error.message}`,
    };
  }
}
