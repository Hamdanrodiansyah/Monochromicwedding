(() => {
  // Menandai dekorasi botanical siap dianimasikan
  const botanicalFrame = document.querySelector('.botanical-frame');

  if (botanicalFrame) {
    requestAnimationFrame(() => {
      botanicalFrame.classList.add('botanical-ready');
    });
  }
  const data = window.WEDDING_DATA || {};

  const params = new URLSearchParams(window.location.search);

  const guest = (params.get('to') || '').trim() || 'Tamu Undangan';

  const getElement = (id) => document.getElementById(id);

  const setText = (id, value) => {
    const element = getElement(id);

    if (element) {
      element.textContent = value;
    }
  };

  setText('groom', data.groomName || 'Mempelai Pria');
  setText('bride', data.brideName || 'Mempelai Wanita');
  setText('wedding-date', data.dateLabel || 'Tanggal Pernikahan');
  setText('guest-name', guest);

  if (data.dateISO) {
    setText('year', data.dateISO.slice(0, 4));

    setText('date-short', `${data.dateISO.slice(8, 10)} · ` + `${data.dateISO.slice(5, 7)} · ` + `${data.dateISO.slice(0, 4)}`);
  }

  const button = getElement('open-invitation');
  const music = getElement('wedding-music');
  const cover = document.querySelector('.cover');

  if (!button || !music || !cover) return;

  // Pertahankan nama tamu saat berpindah halaman.
  const destination = new URL('invitation.html', window.location.href);

  if (params.has('to') && guest !== 'Tamu Undangan') {
    destination.searchParams.set('to', guest);
  }

  button.addEventListener('click', async () => {
    if (button.disabled) return;

    button.disabled = true;

    // Simpan pilihan musik untuk halaman utama.
    try {
      sessionStorage.setItem('weddingMusicWanted', 'true');
    } catch (error) {
      // Tetap lanjut meskipun sessionStorage tidak tersedia.
    }

    // Mulai musik setelah interaksi pengguna.
    music.volume = 0.35;

    try {
      await music.play();
    } catch (error) {
      // Jika gagal, halaman tetap bisa dibuka.
      console.info('Musik belum dapat diputar. Periksa file audio atau kontrol browser.');
    }

    // Jalankan fade keluar.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reducedMotion) {
      cover.classList.add('is-leaving');
    }

    window.setTimeout(
      () => {
        window.location.href = destination.href;
      },
      reducedMotion ? 0 : 500,
    );
  });
})();
