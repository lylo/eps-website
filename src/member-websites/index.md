---
layout: page.njk
title: Member's websites
description: Edinburgh Photographic Society - Member's websites
---
Many members of the EPS maintain their own photography websites to display their work. The table below will take you to some of these sites.

Edinburgh Photographic Society takes no responsibility for the content of member's websites and does not endorse any products or services offered by members through their personal sites.

<table class="w-full table-auto border-collapse">
  <thead>
    <tr>
      <th>Member</th>
      <th>Website</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
  {%- for member in memberWebsites -%}
    <tr>
      <td>{{ member.name }}</td>
      <td>
        <a href="{{ member.url }}" target="_blank" class="text-blue-600 hover:underline">{{ member.url }}</a>
        {%- if member.secondaryUrl -%}
        <br>
        <a href="{{ member.secondaryUrl }}" target="_blank" class="text-blue-600 hover:underline">{{ member.secondaryUrl }}</a>
        {%- endif -%}
      </td>
      <td>{{ member.description }}</td>
    </tr>
  {%- endfor -%}
  </tbody>
</table>
