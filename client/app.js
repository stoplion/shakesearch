import './style.scss';

class SearchController {
  constructor() {
    this.search = this.search.bind(this);
    this.showZeroState = this.showZeroState.bind(this);
    this.populateTable = this.populateTable.bind(this);
    this.populateHeader = this.populateHeader.bind(this);
    this.updateTable = this.updateTable.bind(this);
    this.highlightQuery = this.highlightQuery.bind(this);
  }

  search(ev) {
    ev.preventDefault();
    const form = document.getElementById('form');
    const { query } = Object.fromEntries(new FormData(form));

    this.queryRX = new RegExp(`(${query})`, 'gi');
    this.query = query;

    if (!this.query) {
      this.showZeroState();
      return;
    }

    const response = fetch(`/search?q=${this.query}`).then((response) => {
      response.json().then((results) => {
        this.updateTable(results);
      });
    });
  }

  showZeroState() {
    const table = document.getElementById('table-body');
    const rows = [];

    const row = `<tr>
          <td>
            <div class="no-results">No Results.</div>
          </td>
        </tr>`;

    rows.push(row);
    table.innerHTML = rows.join('');
  }

  populateTable(results) {
    const table = document.getElementById('table-body');
    const rows = [];

    for (let result of results) {
      const highlightedResult = this.highlightQuery(result);
      const row = `
        <tr>
          <td class="result-item">
            <div class="result-body">${highlightedResult}</div>
          </td>
        </tr>
      `;
      rows.push(row);
    }

    table.innerHTML = rows.join('');
  }

  populateHeader(numResults) {
    const searchHeader = document.getElementById('search-header');
    searchHeader.innerHTML = `Search results for ${this.query} (${numResults})`;
  }

  rmHeader() {
    const searchHeader = document.getElementById('search-header');
    searchHeader.innerHTML = '';
  }

  updateTable(results) {
    const table = document.getElementById('table-body');
    const rows = [];

    if (results.length === 0) {
      this.showZeroState();
      this.rmHeader();
      return;
    } else {
      this.populateHeader(results.length);
      this.populateTable(results);
    }
  }

  highlightQuery(result) {
    return result.replace(
      this.queryRX,
      '<span class="highlight-query">$1</span>'
    );
  }
}

const form = document.getElementById('form');
const searchController = new SearchController();
form.addEventListener('submit', searchController.search);
