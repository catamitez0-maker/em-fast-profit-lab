(() => {
  const $ = (selector) => document.querySelector(selector);

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, number) : fallback;
  }

  function money(value) {
    return `$${Math.round(safeNumber(value)).toLocaleString()}`;
  }

  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined && text !== null) node.textContent = String(text);
    if (className) node.className = className;
    return node;
  }

  function csvToRows(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];

      if (char === '"' && quoted && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        row.push(cell);
        cell = "";
      } else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") index += 1;
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }

    row.push(cell);
    rows.push(row);
    return rows.filter((cells) => cells.some((cellValue) => String(cellValue).trim()));
  }

  function csvCell(value) {
    let text = String(value ?? "");
    if (/^[=+\-@]/.test(text.trim())) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  }

  function badgeCell(text, className = "badge") {
    return { text, className };
  }

  function tableNode(headers, bodyRows) {
    const wrap = el("div", null, "table-wrap");
    const table = el("table");
    const thead = el("thead");
    const headerRow = el("tr");
    headers.forEach((header) => headerRow.appendChild(el("th", header)));
    thead.appendChild(headerRow);

    const tbody = el("tbody");
    bodyRows.forEach((row) => {
      const tr = el("tr");
      row.forEach((cell) => {
        const td = el("td");
        if (cell && typeof cell === "object") {
          td.appendChild(el("span", cell.text, cell.className || "badge"));
        } else {
          td.textContent = String(cell ?? "");
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.append(thead, tbody);
    wrap.appendChild(table);
    return wrap;
  }

  function renderTableInto(target, headers, bodyRows) {
    target.replaceChildren(tableNode(headers, bodyRows));
  }

  function download(name, text, type = "text/plain;charset=utf-8") {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function toast(message) {
    const target = $("#toast");
    if (!target) return;
    target.textContent = message;
    target.classList.add("show");
    setTimeout(() => target.classList.remove("show"), 1500);
  }

  async function copyText(text) {
    if (!navigator.clipboard?.writeText) {
      toast("Copy unavailable");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied");
    } catch {
      toast("Copy failed");
    }
  }

  function bindTabs() {
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".tab,.view").forEach((item) => item.classList.remove("active"));
        tab.classList.add("active");
        const view = $(`#${tab.dataset.view}View`);
        if (view) view.classList.add("active");
      });
    });
  }

  window.AppKit = {
    $,
    safeNumber,
    money,
    el,
    csvToRows,
    csvCell,
    badgeCell,
    tableNode,
    renderTableInto,
    download,
    toast,
    copyText,
    bindTabs
  };
})();
