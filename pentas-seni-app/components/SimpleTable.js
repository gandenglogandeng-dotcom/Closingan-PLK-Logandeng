import { useEffect, useState } from "react";

/**
 * Komponen tabel CRUD generik untuk tab spreadsheet sederhana.
 * fields: [{ name, label, type }]
 */
export default function SimpleTable({ tab, fields, title, description }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const emptyForm = Object.fromEntries(fields.map((f) => [f.name, ""]));
  const [form, setForm] = useState(emptyForm);
  const [editingRow, setEditingRow] = useState(null);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/sheet?tab=${tab}`).then((r) => r.json());
    setRows(res.rows || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingRow) {
      await fetch(`/api/sheet?tab=${tab}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _row: editingRow._row, ...form }),
      });
    } else {
      await fetch(`/api/sheet?tab=${tab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm(emptyForm);
    setEditingRow(null);
    load();
  }

  function startEdit(row) {
    setEditingRow(row);
    const f = {};
    fields.forEach((fl) => (f[fl.name] = row[fl.name]));
    setForm(f);
  }

  async function handleDelete(row) {
    if (!confirm("Hapus baris ini?")) return;
    await fetch(`/api/sheet?tab=${tab}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _row: row._row }),
    });
    load();
  }

  return (
    <div>
      <h1>{title}</h1>
      {description && <p style={{ color: "var(--muted)" }}>{description}</p>}

      <div className="card no-print">
        <h3>{editingRow ? "Edit Data" : "Tambah Data"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {fields.map((f) =>
              f.type === "select" ? (
                <select key={f.name} name={f.name} value={form[f.name]} onChange={handleChange} required={f.required}>
                  <option value="">{f.label}</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  key={f.name}
                  name={f.name}
                  type={f.type || "text"}
                  placeholder={f.label}
                  value={form[f.name]}
                  onChange={handleChange}
                  required={f.required}
                />
              )
            )}
          </div>
          <button className="btn" type="submit">
            {editingRow ? "💾 Simpan Perubahan" : "➕ Tambah"}
          </button>
          {editingRow && (
            <button
              type="button"
              className="btn outline"
              style={{ marginLeft: 8 }}
              onClick={() => {
                setEditingRow(null);
                setForm(emptyForm);
              }}
            >
              Batal
            </button>
          )}
        </form>
      </div>

      <div className="card">
        {loading ? (
          <p>Memuat...</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {fields.map((f) => (
                    <th key={f.name}>{f.label}</th>
                  ))}
                  <th className="no-print">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._row}>
                    {fields.map((f) => (
                      <td key={f.name}>{r[f.name]}</td>
                    ))}
                    <td className="no-print">
                      <button className="btn small" onClick={() => startEdit(r)}>
                        Edit
                      </button>{" "}
                      <button className="btn small danger" onClick={() => handleDelete(r)}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={fields.length + 1} style={{ textAlign: "center", color: "var(--muted)" }}>
                      Belum ada data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
