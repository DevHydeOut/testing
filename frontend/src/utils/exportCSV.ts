export function exportToCSV(data: any[], filename = "customers.csv") {
  const csvRows = [];

  // Get headers
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  // Get rows
  for (const row of data) {
    const values = headers.map((header) =>
      JSON.stringify(row[header], (_, value) =>
        typeof value === "string" ? value.replace(/"/g, '""') : value
      )
    );
    csvRows.push(values.join(","));
  }

  // Create a blob and trigger download
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  a.click();
}
