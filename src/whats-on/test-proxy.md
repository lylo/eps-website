---
layout: page.njk
title: What's on
description: Edinburgh Photographic Society - What's on
---
Society meetings are held weekly throughout our session (September to April). During the summer, we have informally organised meetings and we normally take a break in August, when the International Print Exhibition is on display.

Full meetings are held on Wednesday evenings at 7.30 and some meetings are streamed on Zoom.

CD group meetings are held weekly on a Monday evening, Nature group meetings are held monthly on a Tuesday evening, Phoenix group meetings are held on a Thursday and Photo book group meetings are a mixture of Tuesday and Thursday evenings each month.

Studio beginners workshops are also held on a Tuesday evening.

Forthcoming meetings are shown in the calendar below.

<!-- Agenda will be dynamically fetched using a Netlify function -->
<div id="agenda" class="mt-8">
  <div id="agenda-loading" class="text-center text-gray-500">Loading agenda...</div>
  <script>
    async function fetchAgenda() {
      const loadingDiv = document.getElementById('agenda-loading');
      try {
        const response = await fetch('/.netlify/functions/fetch-agenda');
        if (!response.ok) {
          document.getElementById('agenda').innerHTML = '<p class="text-red-500">Failed to load agenda. Please try again later.</p>';
          return;
        }
        const agendaHtml = await response.text();
        document.getElementById('agenda').innerHTML = agendaHtml;
      } catch (error) {
        document.getElementById('agenda').innerHTML = '<p class="text-red-500">Failed to load agenda. Please try again later.</p>';
      } finally {
        if (loadingDiv) loadingDiv.remove();
      }
    }
    fetchAgenda();
  </script>
</div>

Our complete syllabus is included in our member's handbook (2024-25), which you can [view](https://www.dropbox.com/scl/fi/3kqwkoktry3w0jgzsata6/Final-syllabus-1a.pdf?rlkey=84h815xqrdxz0sc9zl13le10m&dl=0) (in a new browser tab) or [download](https://www.dropbox.com/scl/fi/3kqwkoktry3w0jgzsata6/Final-syllabus-1a.pdf?rlkey=84h815xqrdxz0sc9zl13le10m&dl=1). As well as the syllabus, the handbook includes further information for members, such as a list of Council members, competition rules and so on.

You may also subscribe to our Google Calendar or download the syllabus in ics format. This is a standard calendar format that can be read by most calendar apps. To subscribe to our Google Calendar, you should (from within your own Google calendar) select 'add a calendar' and search for epswebby@gmail.com.

[Download EPS Programme in ics format](https://www.dropbox.com/scl/fi/xtr59tc0xxp4otwpvqzbf/Edinburgh-Photographic-Society-Calendar_2024-25-gmail.com.ics?rlkey=i5b36eey3elgaqkjxx0pv7fri&dl=1).

[Download EPS Programme as a csv file](https://www.dropbox.com/scl/fi/onh2pbcxxh8xa2qqadrsy/EPS-calendar-2024-25.csv?rlkey=2a5byun62zgz15vsfk4krohcu&dl=1).
