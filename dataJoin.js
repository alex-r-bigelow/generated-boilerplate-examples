import * as d3 from 'd3';
import mure from 'mure';

/*
  One chunk of what your code would look like:
*/
mure.db.changes({
  since: 'now',
  live: true
}).on('change', function (changeObj) {
  // TODO: respond to whole files being created / opened / destroyed by some other app

  // Get the current selection; either a string or null if nothing is selected
  let currentSelection = changeObj.doc.currentSelection;
  // ... the string might look something like:
  currentSelection = 'svg > g.barChart > g.bar';

  // Infer the common structure to all shared elements...
  let commonStructure = mure.inferStructure(currentSelection);
  // ... which might look something like this:
  commonStructure = {
    'tag': 'g',
    'children': [
      {
        'tag': 'rect'
      }, {
        'tag': 'text',
        'children': [
          {
            'tag': 'tspan'
          }
        ]
      }
    ]
  };

  // Get whatever datasets some other app embedded in the document...
  // (it's possible we might do this differently)
  let embeddedDatasets = mure.getEmbeddedDatasets(changeObj);

  // TODO: update your interface using this new information
  updateInterface(commonStructure, embeddedDatasets);
});

/*
   The simplest code that you'd generate would probably look something like:
*/
let groups = d3.select('svg > g.barChart').selectAll('g.bar')
  .data(embeddedDatasets['flowers.csv']); // I'm still a little fuzzy exactly how we want to reference datasets
let groupsEnter = groups.enter().append('g');
groups.exit().remove();
groups = groups.merge(groupsEnter);
groups.classed('bar', true);

let rectsEnter = groupsEnter.append('rect');
let rects = groups.select('rect');

let textEnter = groupsEnter.append('text');
let text = groups.select('text');

let tspanEnter = textEnter.append('tspan');
let tspan = text.select('tspan');

/*
  Other apps would rely on selections like
  groups, groupsEnter, rects, rectsEnter, text, textEnter, tspan, and tspanEnter
  in order to do things like .attr(), .on(), etc
*/
