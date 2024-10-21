import * as TableCore from 'https://cdn.jsdelivr.net/npm/@tanstack/table-core@8.20.5/+esm';

const { createTable, getCoreRowModel } = TableCore;

// Define the data and columns
const data = [
  {
      fullName: "Alice Johnson",
      position: "Software Engineer",
      department: "Engineering",
      yearsOfService: 3
  },
  {
      fullName: "Bob Smith",
      position: "Marketing Specialist",
      department: "Marketing",
      yearsOfService: 7
  },
];

const columnHelper = TableCore.createColumnHelper();
const columns = [
    columnHelper.accessor(row => row.fullName, {
        id: 'fullName',
        cell: info => info.getValue(),
        footer: info => info.column.id,
    }),
    columnHelper.accessor(row => row.position, {
        id: 'position',
        cell: info => `<i>${info.getValue()}</i>`,
        header: () => `<span>Position</span>`,
        footer: info => info.column.id,
    }),//...
];

const table = TableCore.createTable({
    data,
    columns,
    getCoreRowModel: TableCore.getCoreRowModel(),
    state: {
        columnPinning: {},
        pagination: {},
    },
    debugAll: true,
});

function drawTable(rootElementId, tableModel) {
  const rootElement = document.getElementById(rootElementId);
  const tableElement = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const tfoot = document.createElement("tfoot");

  thead.append(...tableModel.getHeaderGroups().map(headerGroup => {
      const rowElement = document.createElement("tr");
      rowElement.append(...headerGroup.headers.map(header => {
          const cellElement = document.createElement("th");
          cellElement.innerHTML = flexRender(header.column.columnDef.header, header.getContext());
          return cellElement;
      }));
      return rowElement;
  }));
  // 

  tbody.append(...tableModel.getRowModel().rows.map(row => {
      const rowElement = document.createElement("tr");
      rowElement.append(...row.getVisibleCells().map(cell => {
          const cellElement = document.createElement("td");
          cellElement.innerHTML = flexRender(cell.column.columnDef.cell, cell.getContext());
          return cellElement;
      }));
      return rowElement;
  }));

  tfoot.append(...tableModel.getFooterGroups().map(footerGroup => {
      const rowElement = document.createElement("tr");
      rowElement.append(...footerGroup.headers.map(header => {
          const cellElement = document.createElement("th");
          cellElement.innerHTML = flexRender(header.column.columnDef.footer, header.getContext());
          return cellElement;
      }));
      return rowElement;
  }));
  tableElement.append(thead, tbody, tfoot);
  tableElement.id = rootElementId;
  rootElement.replaceWith(tableElement);

  function flexRender(renderer, context) {
      // if the content is unsafe, you can sanitize it here
      if (typeof renderer === "function") {
          return renderer(context);
      }
      return renderer
  }
}

drawTable("table", table);