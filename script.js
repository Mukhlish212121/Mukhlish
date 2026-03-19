/* script.js */

let counter = 1;

function hitungKiblat() {
    const inputNama = document.getElementById("namaLokasi").value;
    const nama = inputNama.trim() !== "" ? inputNama : `Lokasi Pengujian ${counter}`;
    const lat = parseFloat(document.getElementById("latitude").value);
    const lon = parseFloat(document.getElementById("longitude").value);

    if (isNaN(lat) || isNaN(lon)) {
        alert("Harap masukkan koordinat lintang dan bujur yang valid berupa angka murni.");
        return;
    }

    const LQ = 21.4225; // Lintang Ka'bah
    const BQ = 39.8262; // Bujur Ka'bah

    const degToRad = (deg) => (deg * Math.PI) / 180;
    const radToDeg = (rad) => (rad * 180) / Math.PI;

    const lat_rad = degToRad(lat);
    const latQ_rad = degToRad(LQ);
    const deltaB_rad = degToRad(BQ - lon);

    // ============================================
    // A. Model Bumi Bulat
    // ============================================
    const y1 = Math.sin(deltaB_rad);
    const x1 = Math.cos(lat_rad) * Math.tan(latQ_rad) - Math.sin(lat_rad) * Math.cos(deltaB_rad);
    let kiblatBulat = radToDeg(Math.atan2(y1, x1));
    if (kiblatBulat < 0) kiblatBulat += 360; 

    // ============================================
    // B. Model Bumi Datar
    // ============================================
    const deltaB = degToRad(lon - BQ);
    const atas = (90 - LQ) * Math.sin(deltaB);
    const bawah = LQ * Math.cos(deltaB) - lat + 90 * (1 - Math.cos(deltaB));
    let kiblatDatar = 360 - radToDeg(Math.atan2(atas, bawah));
    if (kiblatDatar < 0) kiblatDatar += 360;

    const selisih = Math.abs(kiblatBulat - kiblatDatar);

    // Render Hasil Teks
    document.getElementById("hasilBulat").innerHTML = kiblatBulat.toFixed(4) + "&deg;";
    document.getElementById("hasilDatar").innerHTML = kiblatDatar.toFixed(4) + "&deg;";
    document.getElementById("selisih").innerHTML = selisih.toFixed(4) + "&deg;";

    // ============================================
    // C. ANIMASI JARUM KOMPAS (Fitur Baru)
    // ============================================
    // Rotasi jarum disesuaikan dengan derajat yang dihitung
    document.getElementById("arrow-bulat").style.transform = `rotate(${kiblatBulat}deg)`;
    document.getElementById("arrow-datar").style.transform = `rotate(${kiblatDatar}deg)`;

    // Inject Tabel Log
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
}

$(document).ready(function () {
    $("#hamburger").click(function () {
        $("#nav-links").toggleClass("active");
        $(this).find("i").toggleClass("fa-bars fa-times");
    });

    function showSection(sectionId) {
        $(".section").removeClass("active");
        $("#" + sectionId).addClass("active");
        $(".nav-link").removeClass("active");
        $('.nav-link[data-section="' + sectionId + '"]').addClass("active");

        if ($(window).width() <= 768) {
            $("#nav-links").removeClass("active");
            $("#hamburger").find("i").removeClass("fa-times").addClass("fa-bars");
        }
        $("html, body").animate({ scrollTop: 0 }, 500);
    }

    $(document).on("click", ".nav-link, .section-link", function (e) {
        e.preventDefault();
        const targetSection = $(this).attr("data-section");
        if (targetSection) showSection(targetSection);
    });

    $("#part-a").click(function () {
        $(".arah-eksplain").slideToggle(300);
        $(this).toggleClass("open");
        const icon = $(this).find(".toggle-icon i");
        icon.toggleClass("fa-chevron-down fa-chevron-up");
    });
});
