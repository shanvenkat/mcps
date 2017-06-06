This readme has 2 sections:
1 - CD3 Overview
2 - Miscellaneous Notes
3 - debugging tricks


---
Section 1, CD3 Overview
---
A CD3 means a comp data determination document.

When a wireframe is produced, we begin to analyze the data needed to fulfill requirements.
The CD3 begins around the wireframe and it is finalized after the comp, before development.


---
Section 2, Miscellaneous Notes
---
These notes are working guidelines atm, not enforced (yet).

standard stack:
  - brackets and tortoiseGit (or webstorm if you're cool like salma)
  - PicPick: eyedropper and more
  - Greenshot: Improved snippet tool with delay
  - NotePad++ can be useful; XMLtools is a good formatter and JS tools also.
  - Chrome extension JSON Formatter

setup:
  - Ask Andrew or Jonathan (CM guys) to grant access to the bitbucket repo at bitbucket.org/mcfpbpaco1/ui.git

styles and conventions:
  - name folders downcase
  - brackets set to 2 spaces; no tabs
  - classes in alpha where possible
  - functions in alpha where possible (sort plugin helps too)
  - folder names in downcase
  - we need to 'use strict' and declare variables up top; ideally using Hungarian
  - problem eg arrcollectZipSelect = []; with no const/let/var
  - can we use es2015? I sure say yes
  - linting and/or static analysis

feature list:
  - home page (head, body, footer)
  - search pages and flyouts
  - ./type page

miscellaneous notes:
  - is Content folder even being used...? If so, rename; if not, delete.
  - peer review doesn't exist

tasks to propose:
  - social buttons instead of links, with hover, in footer

CM:
  - Use feature branches
  - Traditionally, a ticket = a feature branch and you name it like DE123 or US123
  - But, we sometimes microsplit our stories here. Good for Scrum planning, but creates excessive branching
  - So, understand the feature a ticket belongs to. This can be determined by discussing w the BA or at design review.
  - Include your ticket # in your git commit message
    - include a very short title message, hit return twice and add more info.

  - Be sure to fetch first to minimize conflicts
  - A GUI tool like TortoiseGit will help.
  - Master is the deployment branch. nothing gets there without peer review.
  - Dev is the working source of truth.
    - Dev vs master? Dev can have bugs and it's np. It won't deploy.

architecture:
  - based off of https://github.com/angular/angular-seed/
  - use feature-oriented architecture, not filetype-oriented
      - consider many modules, you have to change 1 folder not many


---
Section 3, Debugging Tricks
---
Place a debugger anywhere in the app and when you hit it, run this in the console for a list of registered directives:
    myapp
      ._invokeQueue
      .filter(item => 'directive' === item[1])
      .map(item => item[2][0]);
