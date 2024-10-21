import * as TableCore from 'https://cdn.jsdelivr.net/npm/@tanstack/table-core@8.20.5/+esm';

const { createTable, getCoreRowModel, getPaginationRowModel } = TableCore;

// Flex renderer
const flexRenderer = (comp, attrs) => {
  if (typeof comp === 'function') {
    return comp(attrs);
  }
  return comp;
};

// Sample data
const data = [
  { firstName: 'Jane', lastName: 'Doe', age: 30 },
  { firstName: 'John', lastName: 'Doe', age: 32 },
  { firstName: 'Alice', lastName: 'Johnson', age: 25 },
  { firstName: 'Bob', lastName: 'Smith', age: 27 },
  { firstName: 'William', lastName: 'Doe', age: 41 },
  { firstName: 'Isabella', lastName: 'Clark', age: 28 },
  { firstName: 'Alice', lastName: 'Thomas', age: 37 },
  { firstName: 'Ava', lastName: 'Taylor', age: 51 },
  { firstName: 'Lily', lastName: 'Miller', age: 24 },
  { firstName: 'Lily', lastName: 'Thompson', age: 33 },
  { firstName: 'Sophia', lastName: 'Jackson', age: 41 },
  { firstName: 'Amelia', lastName: 'Moore', age: 48 },
  { firstName: 'Charlotte', lastName: 'Brown', age: 43 },
  { firstName: 'Noah', lastName: 'Jackson', age: 32 },
  { firstName: 'Bob', lastName: 'Jackson', age: 57 },
  { firstName: 'Olivia', lastName: 'Miller', age: 34 },
  { firstName: 'Oliver', lastName: 'Anderson', age: 59 },
  { firstName: 'William', lastName: 'Rodriguez', age: 28 },
  { firstName: 'Jane', lastName: 'Hall', age: 32 },
  { firstName: 'Bob', lastName: 'Rodriguez', age: 56 },
  { firstName: 'James', lastName: 'Martinez', age: 19 },
  { firstName: 'Charlotte', lastName: 'Clark', age: 51 },
  { firstName: 'Bob', lastName: 'Doe', age: 20 },
  { firstName: 'Ava', lastName: 'Rodriguez', age: 30 },
  { firstName: 'Emma', lastName: 'Doe', age: 32 },
];

// Define the columns
const columns = [
  {
    accessorKey: 'firstName', // Accessor is the "key" in the data
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
];

// Create a table instance
const table = createTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  state: {
    columnPinning: {},
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  },
  onStateChange: () => {},
  renderFallbackValue: undefined,
  debugTable: true,
});

// Render the table
function renderTable() {
  console.log('renderTable called');

  // Create table elements
  const tableElement = document.createElement('table');
  const theadElement = document.createElement('thead');
  const tbodyElement = document.createElement('tbody');
  tableElement.classList.add('table', 'table-hover', 'table-striped');
  tableElement.appendChild(theadElement);
  tableElement.appendChild(tbodyElement);

  // Render table headers
  table.getHeaderGroups().forEach((headerGroup) => {
    const tr = document.createElement('tr');
    headerGroup.headers.forEach((header) => {
      const th = document.createElement('th');
      th.textContent = header.isPlaceholder
        ? ''
        : flexRenderer(header.column.columnDef.header, header.getContext());
      tr.appendChild(th);
    });
    theadElement.appendChild(tr);
  });

  // Render table rows for the current page
  table.getRowModel().rows.forEach((row) => {
    const tr = document.createElement('tr');
    row.getVisibleCells().forEach((cell) => {
      const td = document.createElement('td');
      td.textContent = flexRenderer(cell.column.columnDef.cell, cell.getContext());
      tr.appendChild(td);
    });
    tbodyElement.appendChild(tr);
  });

  // Pagination controls
  const paginationElement = document.createElement('div');

  // Previous page button
  const prevButton = document.createElement('button');
  prevButton.classList.add('btn', 'btn-primary', 'me-2');
  prevButton.textContent = 'Previous';
  prevButton.disabled = !table.getCanPreviousPage();
  prevButton.onclick = () => {
    console.log('previousButton clicked');
    table.setPageIndex(table.getState().pagination.pageIndex - 1); // Update the page index
    renderTable(); // Re-render the table with updated page
  };
  
  paginationElement.appendChild(prevButton);

  // Next page button
  const nextButton = document.createElement('button');
  nextButton.classList.add('btn', 'btn-primary', 'me-2');
  nextButton.textContent = 'Next';
  nextButton.disabled = !table.getCanNextPage();
  nextButton.onclick = () => {
    console.log('nextButton clicked');
    table.setPageIndex(table.getState().pagination.pageIndex + 1); // Update the page index
    renderTable(); // Re-render the table with updated page
  };
  paginationElement.appendChild(nextButton);

  // Clear previous content and append new content
  const tableWrapperElement = document.getElementById('table-wrapper');
  if (tableWrapperElement) {
    tableWrapperElement.innerHTML = '';
    tableWrapperElement.appendChild(tableElement); // Add table
    tableWrapperElement.appendChild(paginationElement); // Add pagination controls
  }
}

document.addEventListener('DOMContentLoaded', function () {
  renderTable();
});
