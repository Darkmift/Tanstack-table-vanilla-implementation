import * as TableCore from 'https://cdn.jsdelivr.net/npm/@tanstack/table-core@8.20.5/+esm';
import { faker } from 'https://esm.sh/@faker-js/faker';
const {
  createTable,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} = TableCore;

const flexRender = (comp, props) => {
  if (typeof comp === 'function') {
    return comp(props);
  }
  return comp;
};

export function renderTable(tableContainer, table) {
  // Create table elements
  const tableElement = document.createElement('table');
  const theadElement = document.createElement('thead');
  const tbodyElement = document.createElement('tbody');

  tableElement.appendChild(theadElement);
  tableElement.appendChild(tbodyElement);

  // Render table rows for the current page
  table.getRowModel().rows.forEach((row) => {
    const tr = document.createElement('tr');
    row.getVisibleCells().forEach((cell) => {
      const td = document.createElement('td');
      td.innerHTML = flexRender(cell.column.columnDef.cell, cell.getContext());
      tr.appendChild(td);
    });
    tbodyElement.appendChild(tr);
  });

  // Pagination controls
  const paginationElement = document.createElement('div');

  // Previous page button
  const prevButton = document.createElement('button');
  prevButton.innerHTML = 'Previous';
  prevButton.disabled = !table.getCanPreviousPage();
  prevButton.onclick = () => {
    table.previousPage();
  };
  paginationElement.appendChild(prevButton);

  // Next page button
  const nextButton = document.createElement('button');
  nextButton.innerHTML = 'Next';
  nextButton.disabled = !table.getCanNextPage();
  nextButton.onclick = () => {
    table.nextPage();
  };
  paginationElement.appendChild(nextButton);

  // Page size
  const pageSizeSelect = document.createElement('select');
  const pageSizeOptions = [5, 10, 20, 30, 40, 50];
  pageSizeOptions.forEach((pageSize) => {
    const pageSizeOption = document.createElement('option');
    pageSizeOption.selected = table.getState().pagination.pageSize === pageSize;
    pageSizeOption.value = pageSize.toString();
    pageSizeOption.textContent = `Show ${pageSize}`;
    pageSizeSelect.appendChild(pageSizeOption);
  });
  pageSizeSelect.onchange = (event) => {
    const newPageSize = Number(event.target.value);
    table.setPageSize(newPageSize);
  };
  paginationElement.appendChild(pageSizeSelect);

  // Page information
  const pageInformationElement = document.createElement('div');
  pageInformationElement.innerHTML = `Showing ${table
    .getRowModel()
    .rows.length.toLocaleString()} of ${table.getRowCount().toLocaleString()} Rows`;

  // Table state
  const stateElement = document.createElement('pre');
  stateElement.innerHTML = JSON.stringify(
    {
      pagination: table.getState().pagination,
      globalFilter: table.getState().globalFilter,
    },
    null,
    2
  );

  // Clear previous content and append new content
  tableContainer.innerHTML = '';
  tableContainer.appendChild(tableElement); // Add table
  tableContainer.appendChild(paginationElement); // Add pagination controls
  tableContainer.appendChild(pageInformationElement); // Add page information
  tableContainer.appendChild(stateElement); // Add state information
}

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int(40),
    visits: faker.number.int(1000),
    progress: faker.number.int(100),
    status: faker.helpers.shuffle(['relationship', 'complicated', 'single'])[0],
  };
};

export function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}

export function createVanillaTable(options) {
  // Compose in the generic options to the user options
  const resolvedOptions = {
    state: {}, // Dummy state
    renderFallbackValue: null,
    ...options,
    onStateChange: (updater) => {
      if (typeof updater === 'function') {
        table.options.state = updater(table.getState());
      } else {
        table.options.state = updater;
      }
      options.onStateChange?.(updater);
    },
  };

  // Create the table
  const table = createTable(resolvedOptions);

  return table;
}

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('firstName', {
    cell: (props) => props.getValue(),
  }),
  columnHelper.accessor('lastName', {
    header: '<span>Last Name</span>',
    cell: (props) => props.getValue(),
  }),
  columnHelper.accessor('age', {
    header: 'Age',
  }),
  columnHelper.accessor('visits', {
    header: '<span>Visits</span>',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
  },
];

const data = makeData(1000);

const tableContainer = document.getElementById('table-container');

const table = createVanillaTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    columnPinning: {},
    pagination: {
      pageIndex: 0,
      pageSize: 5,
    },
    globalFilter: '',
  },
  onStateChange: () => {
    renderTable(tableContainer, table);
  },
  globalFilterFn: (row, columnId, filterValue) => {
    const value = row.getValue(columnId);
    return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
  },
});

// get the filter input
const filterInput = document.getElementById('name-filter');

// Add event listener to the filter input
filterInput.addEventListener('input', (e) => {
  table.setGlobalFilter(e.target.value);
});

renderTable(tableContainer, table);

// const rerenderButton = document.getElementById('rerender-button');

// rerenderButton.addEventListener('click', () => {
//   renderTable(tableContainer, table);
// });
