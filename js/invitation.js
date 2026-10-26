(() => {
  'use strict';

  const data = window.WEDDING_DATA || {};
  const params = new URLSearchParams(window.location.search);

  // ---------------------------------------
  // 1. PERSONALISASI UNDANGAN
  // ---------------------------------------

  const guestName = (params.get('to') || '').trim() || 'Tamu Undangan';

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined && value !== null) {
      element.textContent = value;
    }
  }

  const groom = data.groomName || 'Mempelai Pria';
  const bride = data.brideName || 'Mempelai Wanita';

  setText('hero-groom', groom);
  setText('hero-bride', bride);
  setText('invitation-guest', guestName);
  setText('closing-names', `${groom} & ${bride}`);

  if (data.dateLabel) {
    setText('hero-date', data.dateLabel.toUpperCase());
    setText('event-date', data.dateLabel);
  }

  // ---------------------------------------
  // 2. DETAIL ACARA
  // ---------------------------------------
  // Properti ini bisa kamu tambahkan di wedding-data.js.

  setText('akad-time', data.akadTime || '08.00 WIB — sesuaikan');
  setText('reception-time', data.receptionTime || '11.00 WIB — sesuaikan');
  setText('event-location', data.locationName || 'Nama gedung atau lokasi acara');
  setText('event-address', data.address || 'Alamat lengkap lokasi acara');

  const mapsLink = document.getElementById('maps-link');

  if (mapsLink && data.mapsUrl) {
    try {
      const url = new URL(data.mapsUrl);

      if (url.protocol === 'https:' || url.protocol === 'http:') {
        mapsLink.href = url.href;
      }
    } catch (error) {
      mapsLink.href = '#details';
    }
  } else if (mapsLink) {
    mapsLink.hidden = true;
  }

  // ---------------------------------------
  // 3. DETEKSI PENGURANGAN ANIMASI
  // ---------------------------------------

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------
  // 4. REVEAL SAAT MASUK VIEWPORT
  // ---------------------------------------

  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -35px 0px',
      },
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => {
      element.classList.add('is-visible');
    });
  }

  // ---------------------------------------
  // 5. PARALLAX BERDASARKAN POSISI SCROLL
  // ---------------------------------------

  const parallaxElements = document.querySelectorAll('.parallax-card, .parallax-text');

  let ticking = false;

  function updateParallax() {
    ticking = false;

    if (reduceMotion) return;

    const viewportHeight = window.innerHeight;

    parallaxElements.forEach((element) => {
      const rect = element.getBoundingClientRect();

      // Abaikan elemen yang jauh di luar viewport.
      if (rect.bottom < -150 || rect.top > viewportHeight + 150) {
        return;
      }

      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = (elementCenter - viewportHeight / 2) / viewportHeight;

      // Foto bergerak lebih kuat daripada teks.
      const factor = element.classList.contains('parallax-text') ? -16 : 25;

      const movement = Math.max(-35, Math.min(35, distanceFromCenter * factor));

      element.style.setProperty('--parallax-y', `${movement.toFixed(2)}px`);
    });
  }

  function requestParallaxUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateParallax);
    }
  }

  if (!reduceMotion) {
    window.addEventListener('scroll', requestParallaxUpdate, {
      passive: true,
    });

    window.addEventListener('resize', requestParallaxUpdate);
    updateParallax();
  }

  // ---------------------------------------
  // 6. PROGRESS SCROLL
  // ---------------------------------------

  const progressBar = document.getElementById('scroll-progress-bar');

  function updateScrollProgress() {
    if (!progressBar) return;

    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

    const progress = documentHeight > 0 ? (window.scrollY / documentHeight) * 100 : 0;

    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  window.addEventListener('scroll', updateScrollProgress, {
    passive: true,
  });

  window.addEventListener('resize', updateScrollProgress);
  updateScrollProgress();

  // ---------------------------------------
  // 7. KONTROL MUSIK
  // ---------------------------------------

  const music = document.getElementById('page-music');
  const musicButton = document.getElementById('music-toggle');
  const musicStatus = document.getElementById('music-status');

  if (music && musicButton) {
    music.volume = 0.35;

    function updateMusicControl() {
      const isPlaying = !music.paused;

      if (musicStatus) {
        musicStatus.textContent = isPlaying ? 'Jeda Musik' : 'Putar Musik';
      }

      musicButton.setAttribute('aria-label', isPlaying ? 'Jeda musik' : 'Putar musik');

      musicButton.setAttribute('aria-pressed', String(isPlaying));
    }

    musicButton.addEventListener('click', async () => {
      if (music.paused) {
        try {
          await music.play();
        } catch (error) {
          console.info('Musik belum bisa diputar. Periksa file audio.');
        }
      } else {
        music.pause();
      }

      updateMusicControl();
    });

    music.addEventListener('play', updateMusicControl);
    music.addEventListener('pause', updateMusicControl);

    // Mencoba melanjutkan musik yang diminta dari halaman cover.
    let musicWanted = false;

    try {
      musicWanted = sessionStorage.getItem('weddingMusicWanted') === 'true';
    } catch (error) {
      // Session storage bisa tidak tersedia pada mode tertentu.
    }

    if (musicWanted) {
      music.play().catch(() => {
        // Jika browser menolak autoplay, pengunjung bisa menekan tombol musik.
      });
    }

    updateMusicControl();
  }
  // ---------------------------------------
  // 8. FORM FEEDBACK KE WHATSAPP
  // ---------------------------------------

  const feedbackForm = document.getElementById('feedback-form');
  const feedbackStatus = document.getElementById('feedback-status');

  if (feedbackForm && feedbackStatus) {
    feedbackForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('feedback-name').value.trim();

      const message = document.getElementById('feedback-message').value.trim();

      if (message.length < 5) {
        feedbackStatus.textContent = 'Silakan tuliskan masukan minimal 5 karakter.';
        return;
      }

      // GANTI dengan nomor WhatsApp kamu.
      // Format: kode negara + nomor, tanpa +, spasi, atau tanda hubung.
      const whatsappNumber = '6282318108127';

      const whatsappMessage =
        `Halo Rodiansyah Gallery! 👋\n\n` +
        `Saya telah melihat prototype undangan pernikahan Anda.\n\n` +
        `Nama: ${name || 'Tidak dicantumkan'}\n\n` +
        `Masukan dan saran saya:\n${message}\n\n` +
        `Semoga website ini semakin baik. Semangat berkarya!`;

      const whatsappURL = `https://wa.me/${whatsappNumber}?text=` + encodeURIComponent(whatsappMessage);

      feedbackStatus.textContent = 'Membuka WhatsApp untuk mengirim masukan...';

      window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    });
  }
})();
