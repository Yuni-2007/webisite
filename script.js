

/* =================================
   BLOOMSPACE - JAVASCRIPT
   Fungsi pengelolaan kegiatan
================================= */

// Mengambil elemen dari HTML
const taskForm = document.getElementById("taskForm");
const isiTabel = document.getElementById("isiTabel");
const pencarian = document.getElementById("pencarian");
const pesanKosong = document.getElementById("pesanKosong");

// Mengambil data yang tersimpan di browser
let kegiatan = [];

try {
  const dataTersimpan = localStorage.getItem("bloomspaceTasks");

  kegiatan = dataTersimpan
    ? JSON.parse(dataTersimpan)
    : [];

  if (!Array.isArray(kegiatan)) {
    kegiatan = [];
  }
} catch (error) {
  kegiatan = [];
}

// Menyimpan data ke localStorage
function simpanData() {
  localStorage.setItem(
    "bloomspaceTasks",
    JSON.stringify(kegiatan)
  );
}

// Membuat kolom tabel
function buatSel(teks) {
  const td = document.createElement("td");
  td.textContent = teks;
  return td;
}

// Mengubah format tanggal
function formatTanggal(tanggal) {
  if (!tanggal) return "-";

  const bagian = tanggal.split("-");

  if (bagian.length !== 3) {
    return tanggal;
  }

  return `${bagian[2]}/${bagian[1]}/${bagian[0]}`;
}

// Memperbarui jumlah kegiatan
function perbaruiStatistik() {
  document.getElementById("totalTugas").textContent =
    kegiatan.length;

  document.getElementById("belumSelesai").textContent =
    kegiatan.filter(item => !item.selesai).length;

  document.getElementById("sudahSelesai").textContent =
    kegiatan.filter(item => item.selesai).length;
}

// Menampilkan kegiatan ke dalam tabel
function tampilkanKegiatan() {
  isiTabel.replaceChildren();

  const kataKunci = pencarian.value
    .toLowerCase()
    .trim();

  // Mencari kegiatan berdasarkan nama, kategori, atau catatan
  const hasil = kegiatan.filter(item =>
    (
      item.nama + " " +
      item.kategori + " " +
      item.catatan
    )
      .toLowerCase()
      .includes(kataKunci)
  );

  // Menampilkan setiap kegiatan
  hasil.forEach((item, index) => {
    const baris = document.createElement("tr");

    baris.appendChild(buatSel(index + 1));
    baris.appendChild(buatSel(item.nama));
    baris.appendChild(buatSel(item.kategori));
    baris.appendChild(buatSel(formatTanggal(item.tanggal)));

    // Kolom status
    const tdStatus = document.createElement("td");
    const badge = document.createElement("span");

    badge.className = item.selesai
      ? "status status-done"
      : "status status-pending";

    badge.textContent = item.selesai
      ? "Selesai ♡"
      : "Belum selesai";

    tdStatus.appendChild(badge);
    baris.appendChild(tdStatus);

    // Kolom aksi
    const tdAksi = document.createElement("td");

    // Tombol untuk mengubah status
    const tombolSelesai = document.createElement("button");

    tombolSelesai.type = "button";
    tombolSelesai.className = "action-btn done-btn";

    tombolSelesai.textContent = item.selesai
      ? "Batalkan"
      : "Selesai";

    tombolSelesai.addEventListener("click", function() {
      item.selesai = !item.selesai;

      simpanData();
      tampilkanKegiatan();
    });

    // Tombol untuk menghapus kegiatan
    const tombolHapus = document.createElement("button");

    tombolHapus.type = "button";
    tombolHapus.className = "action-btn delete-btn";
    tombolHapus.textContent = "Hapus";

    tombolHapus.addEventListener("click", function() {
      const yakin = confirm(
        "Apakah kamu yakin ingin menghapus kegiatan ini?"
      );

      if (yakin) {
        kegiatan = kegiatan.filter(
          data => data.id !== item.id
        );

        simpanData();
        tampilkanKegiatan();
      }
    });

    tdAksi.append(tombolSelesai, tombolHapus);
    baris.appendChild(tdAksi);

    isiTabel.appendChild(baris);
  });

  // Pesan jika belum ada kegiatan atau hasil pencarian
  pesanKosong.style.display =
    hasil.length === 0 ? "block" : "none";

  if (kegiatan.length === 0) {
    pesanKosong.textContent =
      "🌸 Belum ada kegiatan. Yuk, tambahkan kegiatan pertamamu!";
  } else if (hasil.length === 0) {
    pesanKosong.textContent =
      "🌷 Tidak ada kegiatan yang cocok dengan pencarianmu.";
  }

  // Memperbarui statistik
  perbaruiStatistik();
}

// Menambahkan kegiatan melalui formulir
taskForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const nama = document
    .getElementById("nama")
    .value
    .trim();

  const kategori =
    document.getElementById("kategori").value;

  const tanggal =
    document.getElementById("tanggal").value;

  const catatan = document
    .getElementById("catatan")
    .value
    .trim();

  // Memeriksa kolom wajib
  if (!nama || !kategori || !tanggal) {
    alert("Yuk, lengkapi semua kolom wajib!");
    return;
  }

  // Membuat objek kegiatan baru
  const tugasBaru = {
    id: Date.now() + Math.random(),
    nama: nama,
    kategori: kategori,
    tanggal: tanggal,
    catatan: catatan,
    selesai: false
  };

  // Memasukkan kegiatan ke dalam array
  kegiatan.push(tugasBaru);

  // Menyimpan dan memperbarui tampilan
  simpanData();
  tampilkanKegiatan();

  // Mengosongkan formulir
  taskForm.reset();

  alert("Yeay! Kegiatan berhasil ditambahkan 🌸");

  // Mengarahkan tampilan ke tabel
  document.getElementById("daftar").scrollIntoView({
    behavior: "smooth"
  });
});

// Fitur pencarian
pencarian.addEventListener(
  "input",
  tampilkanKegiatan
);

// Menampilkan data saat website dibuka
tampilkanKegiatan();
