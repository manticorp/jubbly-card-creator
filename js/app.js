import '/sass/app.scss';
import '/sass/card.scss';
import markdownit from 'markdown-it';
import "./helpers";

window.parseCsv = (str) => {
  const arr = [];
  let quote = false;
  let esc = false;
  let row = 0;
  let col = 0;
  for (let c = 0; c < str.length; c++) {
    const cc = str[c];
    const nc = str[c + 1];
    arr[row] = arr[row] || [];
    arr[row][col] = arr[row][col] || '';

    if (cc === '"' && quote && nc === '"') { arr[row][col] += cc; ++c; continue; }
    if (cc === '"') { quote = !quote; continue; }
    if (cc === ',' && !quote) { ++col; continue; }
    if (cc === '\r' && nc === '\n' && !quote) { ++row; col = 0; ++c; continue; }
    if (cc === '\n' && !quote) { ++row; col = 0; continue; }
    if (cc === '\r' && !quote) { ++row; col = 0; continue; }

    arr[row][col] += cc;
  }
  const headers = arr.shift().map(a => slug(a.trim()).replace('-', '_'));
  const rows = [];
  arr.forEach(line => {
    const row = {};
    let i = 0;
    if (line.length < 2) {
      return;
    }
    let allBlank = true;
    headers.forEach(header => {
      const cell = line[i++];
      if (cell) {
        let d = cell.trim();
        if (d.trim() === '') {
          d = null;
        } else {
          allBlank = false;
        }
        row[header] = d;
      } else {
        row[header] = null;
      }
    });
    if (!allBlank) {
      rows.push(row);
    }
  });
  return rows;
};

const tokenCsv = (str) => {
  const arr = [];
  let quote = false;
  let row = 0;
  let col = 0;
  for (let c = 0; c < str.length; c++) {
    const cc = str[c];
    const nc = str[c + 1];
    arr[row] = arr[row] || [];
    arr[row][col] = arr[row][col] || '';

    if (cc === '"' && quote && nc === '"') { arr[row][col] += cc; ++c; }
    if (cc === '"') { quote = !quote; }
    if (cc === ',' && !quote) { ++col; continue; }
    if (cc === '\r' && nc === '\n' && !quote) { ++row; col = 0; ++c; continue; }
    if (cc === '\n' && !quote) { ++row; col = 0; continue; }
    if (cc === '\r' && !quote) { ++row; col = 0; continue; }

    arr[row][col] += cc;
  }
  return arr;
};

window.loadCsv = async function loadCsv(event) {
  const file = event.target.files.item(0)
  const text = await file.text();
  const csv = parseCsv(text);
  return csv;
};

function highlightCsvs() {
  const els = document.querySelectorAll('.highlight-csv');
  for (let el of els) {
    highlightCsv(el);
  }
};

function highlightCsv(el) {
  const txt = el.querySelector('code').innerHTML;
  const csv = tokenCsv(txt);
  let out = [];
  for(let row of csv) {
    let outrow = [];
    let colnum = 1;
    for (let col of row) {
      let add = '';
      if (colnum !== row.length) {
        add = '<span class="comma">,</span>';
      }
      outrow.push(`<span class="col col-${colnum++}">${col}${add}</span>`);
    }
    out.push(`<span class="row">${outrow.join("")}</span>`);
    // out.push(outrow.join(","));
  }
  let html = out.join("\n");
  el.querySelector('code').innerHTML = html;
  let newEl = document.createElement('p');
  newEl.innerText = 'Click to toggle column alignment.';
  newEl.classList.add('csv-helper');
  let pe = el.parentElement;
  pe.insertBefore(newEl, el);
  newEl.addEventListener('click', () => {
    el.classList.toggle('align');
  });
};

function insertFileContents() {
  document.querySelectorAll('[data-file-contents]').forEach(el => {
    fetch(el.dataset.fileContents)
      .then(a => a.text())
      .then(a=> el.innerHTML = escapeHtml(a))
      .then(a => {
        if (hljs && (el.tagName === 'PRE' || el.tagName === 'CODE') && el.dataset.highlighted) {
          el.dataset.highlighted = null;
          delete el.dataset.highlighted;
          hljs.highlightElement(el);
        }
      });
  });
};

window.presets = {
  cards: {
    patience: {
      name: 'Patience',
      width: '42mm',
      height: '63mm'
    },
    bridge: {
      name: 'Bridge',
      width: '56mm',
      height: '87mm'
    },
    poker: {
      name: 'Poker',
      width: '63mm',
      height: '88mm'
    },
    skat: {
      name: 'Skat',
      width: '59mm',
      height: '91mm'
    },
    tarot: {
      name: 'Tarot',
      width: '70mm',
      height: '120mm'
    },
    square_50: {
      name: 'Square',
      width: '50mm',
      height: '50mm'
    },
    square_75: {
      name: 'Square',
      width: '75mm',
      height: '75mm'
    },
    square_76: {
      name: 'Square',
      width: '76mm',
      height: '76mm'
    },
    square_100: {
      name: 'Square',
      width: '100mm',
      height: '100mm'
    },
  },
  pages: {
    a5: {
      name: 'a5',
      width: (297/2) + 'mm',
      height: '210mm'
    },
    a4: {
      name: 'a4',
      width: '210mm',
      height: '297mm'
    },
    a3: {
      name: 'a3',
      width: '297mm',
      height: '420mm'
    },
    a2: {
      name: 'a2',
      width: '420mm',
      height: (297 * 2) + 'mm'
    }
  }
};


/**
 * String.prototype.repeat polyfill
 */
if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
    'use strict';
    if (this == null) {
      throw new TypeError('can\'t convert ' + this + ' to object');
    }
    var str = '' + this;
    count = +count;
    if (count != count) {
      count = 0;
    }
    if (count < 0) {
      throw new RangeError('repeat count must be non-negative');
    }
    if (count == Infinity) {
      throw new RangeError('repeat count must be less than infinity');
    }
    count = Math.floor(count);
    if (str.length == 0 || count == 0) {
      return '';
    }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (str.length * count >= 1 << 28) {
      throw new RangeError('repeat count must not overflow maximum string size');
    }
    var rpt = '';
    for (var i = 0; i < count; i++) {
      rpt += str;
    }
    return rpt;
  }
}
function createTOCListHtml(array, prefix) {
    var str = "",
        prevLevel = 0,
        nextLevel = 0,
        els = [];
    prefix = prefix || '';
    for (var i = 0, len = array.length; i < len; i++) {
        els.push('    '.repeat(array[i].level) + '<li id="'+prefix+array[i].id+'" data-link-for="'+array[i].id+'"><a href="' + array[i].anchor + '">' + array[i].text + '</a>');
        nextLevel = typeof array[i+1] !== 'undefined' ? array[i+1].level : 0;
        if (nextLevel > array[i].level) {
            els.push('<ol><li>'.repeat(Math.max(0, (nextLevel - array[i].level)-1)) + '<ol>');
        }
        if (nextLevel < array[i].level) {
            els.push('</li></ol>'.repeat(Math.max(0, (array[i].level - nextLevel))));
        }
        if (prevLevel >= array[i].level) {
            els.push('</li>');
        }
        prevLevel = array[i].level;
    }
    return '<ol>' + "\n" + els.join("\n") + "</ol>";
}
function getTOCContents(from, to) {
    var from = from || 2,
        to = to || 6,
        selectors = [],
        contents = [],
        selector;
    for (var i = from; i <= to; i++) {
        selectors.push('h' + i + '[id]');
    }
    selector = selectors.join(',');
    document.querySelectorAll(selector).forEach(function(el){
        var level = (el.nodeName.replace(/[^0-9]/gi, '')/1)-from;
        contents.push({
            text:   el.textContent.replace(/^[0-9iv]+ *[.)-] */gi, ''),
            anchor: '#' + el.id,
            id: el.id,
            level: level/1,
            el: el
        });
    });
    return contents;
}
function slugify(text) {
    text = text.toLowerCase();
    text = text.replace(/[^\w\s]/g, '');
    text = text.replace(/\s\s*/g, '-');
    return text;
}
function permalinkAllHTags(selector, from, to) {
    var from        = from||2,
        to          = to||6,
        selectors   = [],
        contents    = [],
        lastLevel   = 0,
        tree        = [],
        selector;
    for (var i = from; i <= to; i++) {
        selectors.push(selector + ' h' + i + ':not([id]):not(.no-toc)');
    }
    selector = selectors.join(',');
    document.querySelectorAll(selector).forEach(function(el){
        var level = el.nodeName.replace('H', '')/1 - from;
        tree[level] = slugify(el.innerText)
        el.id = tree.slice(0, level+1).join("-");
    });
    return contents;
}

function createToc() {
  const contents = document.querySelector('#auto-toc');
  if (contents) {
    if (window.permalink_all_h_tags ?? true) {
      permalinkAllHTags(
        '',
        window.permalink_from ?? 2,
        window.permalink_to ?? 4
      );
    }
    const tocList = getTOCContents(
      window.permalink_from ?? 2,
      window.permalink_to ?? 4
    );
    contents.innerHTML = createTOCListHtml(tocList, 'main-');
  }
}


document.addEventListener('DOMContentLoaded', () => {
  highlightCsvs();
  insertFileContents();
  createToc();
});

console.log('App running successfully');
