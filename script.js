const surahList = document.getElementById("surahList");
const ayatContainer = document.getElementById("ayatContainer");
const surahTitle = document.getElementById("surahTitle");
const themeBtn = document.getElementById("themeBtn");
const autoScrollBtn = document.getElementById("autoScrollBtn");
const searchSurah = document.getElementById("searchSurah");

let allSurahs = [];
let autoScroll = false;

// Ambil daftar surat
fetch("https://api.alquran.cloud/v1/surah")
  .then(res => res.json())
  .then(data => {
    allSurahs = data.data;
    showSurahList(allSurahs);
  });

// Tampilkan daftar surat
function showSurahList(surahArray) {
  surahList.innerHTML = "";
  surahArray.forEach(surah => {
    const li = document.createElement("li");
    li.textContent = `${surah.number}. ${surah.englishName} (${surah.englishNameTranslation})`;
    li.onclick = () => loadSurah(surah.number, surah.englishName);
    surahList.appendChild(li);
  });
}

// Cari surat
searchSurah.addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase();
  const filtered = allSurahs.filter(s =>
    s.englishName.toLowerCase().includes(keyword) ||
    s.englishNameTranslation.toLowerCase().includes(keyword)
  );
  showSurahList(filtered);
});

// Muat isi surat
function loadSurah(num, name) {
  ayatContainer.innerHTML = "<p>Memuat...</p>";
  surahTitle.innerHTML = `<h2>${num}. ${name}</h2>`;
  fetch(`https://api.alquran.cloud/v1/surah/${num}/editions/quran-uthmani,id.indonesian`)
    .then(res => res.json())
    .then(data => {
      const arab = data.data[0].ayahs;
      const arti = data.data[1].ayahs;
      ayatContainer.innerHTML = "";

      // Tambah Bismillah di awal kecuali At-Taubah (9)
      if (num !== 9) {
        const bis = document.createElement("div");
        bis.className = "bismillah";
        bis.textContent = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
        ayatContainer.appendChild(bis);
      }

      arab.forEach((a, i) => {
        let arabicText = a.text;
        if (num !== 9 && i === 0 && arabicText.startsWith("بِسْمِ")) {
          arabicText = arabicText.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "").trim();
        }

        const div = document.createElement("div");
        div.className = "ayat";
        div.innerHTML = `
          <div class='arabic'>${arabicText}</div>
          <div class='arti'>${arti[i].text}</div>
        `;
        div.onclick = () => {
          const audio = new Audio(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`);
          audio.play();
        };
        ayatContainer.appendChild(div);
      });
    });
}

// Mode Gelap
themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  themeBtn.textContent = document.body.classList.contains("dark")
    ? "☀️ Mode Terang"
    : "🌙 Mode Gelap";
};

// Auto Scroll
autoScrollBtn.onclick = () => {
  autoScroll = !autoScroll;
  autoScrollBtn.textContent = autoScroll ? "⏸️ Stop Scroll" : "🔽 Auto Scroll";
  if (autoScroll) startScroll();
};

function startScroll() {
  if (!autoScroll) return;
  window.scrollBy(0, 1);
  setTimeout(startScroll, 50);
}