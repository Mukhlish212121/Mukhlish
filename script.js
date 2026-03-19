/* script.js */

// Global State
let counter = 1;

/**
 * Mesin Kalkulasi Geodesik (Arah Kiblat)
 * Membandingkan formula Spherical Trigonometry (Bumi Bulat) vs Planar/Cartesian (Bumi Datar)
 */
function hitungKiblat() {
    // 1. Ambil & Validasi Input
    const inputNama = document.getElementById("namaLokasi").value;
    const nama = inputNama.trim() !== "" ? inputNama : `Lokasi Pengujian ${counter}`;
    const lat = parseFloat(document.getElementById("latitude").value);
    const lon = parseFloat(document.getElementById("longitude").value);

    if (isNaN(lat) || isNaN(lon)) {
        alert("Harap masukkan koordinat lintang dan bujur yang valid berupa angka murni.");
        return;
    }

    // 2. Konstanta Geografis Ka'bah
    const LQ = 21.4225; // Lintang
    const BQ = 39.8262; // Bujur

    // Helper Konversi Radian & Derajat
    const degToRad = (deg) => (deg * Math.PI) / 180;
    const radToDeg = (rad) => (rad * 180) / Math.PI;

    // Parameter dalam Radian
    const lat_rad = degToRad(lat);
    const latQ_rad = degToRad(LQ);
    const deltaB_rad = degToRad(BQ - lon);

    // ============================================
    // A. Model Bumi Bulat (Spherical Trigonometry)
    // ============================================
    const y1 = Math.sin(deltaB_rad);
    const x1 = Math.cos(lat_rad) * Math.tan(latQ_rad) - Math.sin(lat_rad) * Math.cos(deltaB_rad);
    
    let kiblatBulat = radToDeg(Math.atan2(y1, x1));
    if (kiblatBulat < 0) kiblatBulat += 360; // Normalisasi ke 360 derajat azimuth

    // ============================================
    // B. Model Bumi Datar (Planar Mathematics)
    // ============================================
    const deltaB = degToRad(lon - BQ);
    const atas = (90 - LQ) * Math.sin(deltaB);
    const bawah = LQ * Math.cos(deltaB) - lat + 90 * (1 - Math.cos(deltaB));
    
    let kiblatDatar = 360 - radToDeg(Math.atan2(atas, bawah));
    if (kiblatDatar < 0) kiblatDatar += 360;

    // ============================================
    // C. Kalkulasi Selisih Deviasi
    // ============================================
    const selisih = Math.abs(kiblatBulat - kiblatDatar);

    // 3. Render Hasil ke UI Utama
    document.getElementById("hasilBulat").innerHTML = kiblatBulat.toFixed(4) + "&deg;";
    document.getElementById("hasilDatar").innerHTML = kiblatDatar.toFixed(4) + "&deg;";
    document.getElementById("selisih").innerHTML = selisih.toFixed(4) + "&deg;";

    // 4. Inject ke Tabel Log Riwayat
    const tbody = document.querySelector("#tabelHasil tbody");
    const row = document.createElement("tr");
    
    row.innerHTML = `
        <td>${counter++}</td>
        <td><strong>${nama}</strong></td>
        <td>${kiblatBulat.toFixed(4)}&deg;</td>
        <td>${kiblatDatar.toFixed(4)}&deg;</td>
        <td style="color: #d32f2f; font-weight: bold;">${selisih.toFixed(4)}&deg;</td>
    `;
    
    tbody.appendChild(row);
    
    // Opsional: Kosongkan field input setelah sukses
    document.getElementById("namaLokasi").value = '';
    document.getElementById("namaLokasi").focus();
}

/**
 * Pengendalian Interface & Interaktivitas UI (Menggunakan jQuery)
 */
$(document).ready(function () {
    
    // --- 1. Manajemen Menu Hamburger (Mobile) ---
    $("#hamburger").click(function () {
        $("#nav-links").toggleClass("active");
        $(this).find("i").toggleClass("fa-bars fa-times");
    });

    // --- 2. Mesin Routing Halaman SPA (Single Page Application) ---
    function showSection(sectionId) {
        // Ganti panel aktif
        $(".section").removeClass("active");
        $("#" + sectionId).addClass("active");

        // Perbarui status link navigasi
        $(".nav-link").removeClass("active");
        $('.nav-link[data-section="' + sectionId + '"]').addClass("active");

        // Tutup menu mobile jika sedang terbuka
        if ($(window).width() <= 768) {
            $("#nav-links").removeClass("active");
            $("#hamburger").find("i").removeClass("fa-times").addClass("fa-bars");
        }

        // Scroll halus ke puncak
        $("html, body").animate({ scrollTop: 0 }, 500);
    }

    // Delegasi klik pada semua pemicu menu (Navigasi Utama & Tombol Action)
    $(document).on("click", ".nav-link, .section-link", function (e) {
        e.preventDefault();
        const targetSection = $(this).attr("data-section");
        if (targetSection) {
            showSection(targetSection);
        }
    });

    // --- 3. Manajemen Akordion "Kenapa saya membuat proyek ini?" ---
    $("#part-a").click(function () {
        $(".arah-eksplain").slideToggle(300);
        $(this).toggleClass("open");
        
        // Putar rotasi ikon
        const icon = $(this).find(".toggle-icon i");
        icon.toggleClass("fa-chevron-down fa-chevron-up");
    });

});