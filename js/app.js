let pembayaranData = [];
let editIndex = null;

// =======================
// LOAD PAGE
// =======================
function loadPage(page) {
  const content = document.getElementById("content");

  // DASHBOARD
  if (page === "dashboard") {
    content.innerHTML = `
      <h3>Dashboard</h3>

      <div class="card">Total Siswa: <span id="totalSiswa">0</span></div>
      <div class="card">Hadir Hari Ini: <span id="hadir">0</span></div>
      <div class="card">Kas: <span id="kas">0</span></div>
      <div class="card">Tunggakan: <span id="tunggakan">0</span></div>
    `;

    loadDashboard();
  }

  // SISWA
  if (page === "siswa") {
    content.innerHTML = `
      <h3>Data Siswa</h3>
      <button onclick="addSiswa()">+ Tambah</button>
      <div id="data"></div>
    `;

    loadSiswa();
  }

  // PEMBAYARAN
  if (page === "pembayaran") {
    content.innerHTML = `
      <h3>Pembayaran</h3>

      <button onclick="openModal()">+ Tambah</button>
      <br><br>

      <input id="search" placeholder="Cari nama..." onkeyup="renderPembayaran()">

      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Bulan</th>
            <th>Jumlah</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody id="data"></tbody>
      </table>
    `;

    loadPembayaran();
  }

  // ABSENSI
  if (page === "absensi") {
    content.innerHTML = `
      <h3>Absensi</h3>
      <button onclick="addAbsensi()">+ Input</button>
      <div id="data"></div>
    `;

    loadAbsensi();
  }
}

// =======================
// DASHBOARD
// =======================
async function loadDashboard() {
  const res = await fetch(API + "?action=getDashboard", {
    method: "POST"
  });

  const data = await res.json();

  document.getElementById("totalSiswa").innerText = data.totalSiswa;
  document.getElementById("hadir").innerText = data.hadirHariIni;
  document.getElementById("kas").innerText = "Rp" + data.kas;
  document.getElementById("tunggakan").innerText = data.tunggakan;
}

// =======================
// SISWA
// =======================
async function loadSiswa() {
  const res = await fetch(API + "?action=getSiswa", {
    method: "POST"
  });

  const data = await res.json();

  document.getElementById("data").innerHTML =
    data.slice(1).map(r => `
      <div>${r[0]} | ${r[1]} | ${r[2]} | ${r[3]}</div>
    `).join("");
}

function addSiswa() {
  const nama = prompt("Nama");
  const kelompok = prompt("Kelompok");
  const ortu = prompt("Orang tua");

  const user = JSON.parse(localStorage.getItem("user"));

  fetch(API + "?action=addSiswa", {
    method: "POST",
    body: JSON.stringify({ nama, kelompok, ortu, role: user.role })
  }).then(loadSiswa);
}

// =======================
// PEMBAYARAN
// =======================
async function loadPembayaran() {
  const res = await fetch(API + "?action=getPembayaran", {
    method: "POST"
  });

  const data = await res.json();
  pembayaranData = data.slice(1);

  renderPembayaran();
}

function renderPembayaran() {
  const search = document.getElementById("search").value.toLowerCase();
  const user = JSON.parse(localStorage.getItem("user"));

  const rows = pembayaranData.filter(r =>
    r[0].toLowerCase().includes(search)
  );

  document.getElementById("data").innerHTML =
    rows.map((r, i) => `
      <tr>
        <td>${r[0]}</td>
        <td>${r[1]}</td>
        <td>Rp${r[2]}</td>
        <td style="color:${r[3]=='Lunas'?'lime':'red'}">${r[3]}</td>

        ${
          user.role === "admin"
          ? `
          <td>
            <button onclick="openModal(${i})">Edit</button>
            <button onclick="hapusPembayaran(${i})">Hapus</button>
          </td>
          `
          : "<td>-</td>"
        }
      </tr>
    `).join("");
}

// =======================
// MODAL
// =======================
function openModal(index = null) {
  document.getElementById("modal").style.display = "flex";

  if (index !== null) {
    const data = pembayaranData[index];
    editIndex = index;

    document.getElementById("modalTitle").innerText = "Edit Pembayaran";
    document.getElementById("fNama").value = data[0];
    document.getElementById("fBulan").value = data[1];
    document.getElementById("fJumlah").value = data[2];
    document.getElementById("fStatus").value = data[3];
  } else {
    editIndex = null;

    document.getElementById("modalTitle").innerText = "Tambah Pembayaran";
    document.getElementById("fNama").value = "";
    document.getElementById("fBulan").value = "";
    document.getElementById("fJumlah").value = "";
    document.getElementById("fStatus").value = "Lunas";
  }
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function submitForm() {
  const nama = document.getElementById("fNama").value;
  const bulan = document.getElementById("fBulan").value;
  const jumlah = document.getElementById("fJumlah").value;
  const status = document.getElementById("fStatus").value;

  const user = JSON.parse(localStorage.getItem("user"));
  const action = editIndex !== null ? "editPembayaran" : "addPembayaran";

  fetch(API + "?action=" + action, {
    method: "POST",
    body: JSON.stringify({
      index: editIndex,
      nama,
      bulan,
      jumlah,
      status,
      role: user.role
    })
  }).then(() => {
    closeModal();
    loadPembayaran();
  });
}

function hapusPembayaran(index) {
  if (!confirm("Yakin hapus data?")) return;

  const user = JSON.parse(localStorage.getItem("user"));

  fetch(API + "?action=deletePembayaran", {
    method: "POST",
    body: JSON.stringify({
      index,
      role: user.role
    })
  }).then(loadPembayaran);
}

// =======================
// ABSENSI
// =======================
async function loadAbsensi() {
  const res = await fetch(API + "?action=getAbsensi", { method: "POST" });
  const data = await res.json();

  document.getElementById("data").innerHTML =
    data.slice(1).map(r => `<div>${r[0]} | ${r[1]} | ${r[2]}</div>`).join("");
}

function addAbsensi() {
  const nama = prompt("Nama");
  const tanggal = new Date().toISOString().split("T")[0];
  const status = prompt("Status");

  const user = JSON.parse(localStorage.getItem("user"));

  fetch(API + "?action=addAbsensi", {
    method: "POST",
    body: JSON.stringify({ nama, tanggal, status, role: user.role })
  }).then(loadAbsensi);
}

// =======================
// LOGOUT
// =======================
function logout() {
  localStorage.clear();
  window.location.replace("index.html");
}