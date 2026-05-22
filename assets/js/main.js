// ★ ローディング非表示処理（バニラJS）
window.addEventListener('load', function () {
  const loading = document.getElementById('loading');
  setTimeout(() => {
    loading.classList.add('fade-out');
  }, 1500); // 1.5秒後にフェードアウト
});

// ==============================
// Swiper 初期化
// ==============================
const productSliderEl = document.querySelector('.product-slider');
const productWrapper = document.querySelector('.product-slider .swiper-wrapper');

if (productSliderEl && productWrapper) {
  // 元のスライドを保存
  const originalSlides = Array.from(productWrapper.children);
  const originalCount = originalSlides.length;

  // 既存の中身をいったん空にする
  productWrapper.innerHTML = '';

  // 同じスライドをたくさん複製して、前後に余裕を作る
  const repeatCount = 9;

  for (let i = 0; i < repeatCount; i++) {
    originalSlides.forEach((slide) => {
      productWrapper.appendChild(slide.cloneNode(true));
    });
  }

  const startIndex = originalCount * 3;
  const resetAfterIndex = originalCount * 6;

  const productSwiper = new Swiper('.product-slider', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    spaceBetween: 16,
    centeredSlides: true,

    // Swiperのloopは使わない
    loop: false,

    // 真ん中あたりから開始
    initialSlide: startIndex,

    // 1つずつ動く速さ
    speed: 900,

    autoplay: false,

    allowTouchMove: true,
    grabCursor: true,
    touchRatio: 1.2,
    threshold: 5,

    breakpoints: {
      769: {
        centeredSlides: false,
        spaceBetween: 24,
      },
    },

    watchSlidesProgress: true,
    roundLengths: true,
    updateOnWindowResize: true,
    observer: true,
    observeParents: true,
  });

  let productSlideTimer;

  function moveProductSlider() {
    // かなり後ろまで進んだら、同じ並びの真ん中へ一瞬で戻す
    // 見た目は同じ商品順なので、戻ったことは分かりにくい
    if (productSwiper.activeIndex >= resetAfterIndex) {
      productSwiper.slideTo(startIndex, 0, false);
    }

    productSwiper.slideNext(900);
  }

  function startProductSlideTimer() {
    clearInterval(productSlideTimer);

    productSlideTimer = setInterval(() => {
      moveProductSlider();
    }, 2500);
  }

  startProductSlideTimer();

  // 手でスワイプしたあとも止めずに再開
  productSwiper.on('touchEnd', function () {
    startProductSlideTimer();
  });

  productSwiper.on('sliderMove', function () {
    clearInterval(productSlideTimer);
  });

  productSwiper.on('transitionEnd', function () {
    startProductSlideTimer();
  });

  // タブを戻した時も再開
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      startProductSlideTimer();
    }
  });
}

// お問い合わせフォーム

(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const msgBox = document.getElementById('formMessage');
  const iframe = document.getElementById('hidden_iframe');

  const nameInput = form.querySelector('[name="entry.1425804916"]');
  const addrInput = form.querySelector('[name="entry.1129032173"]');
  const emailInput = form.querySelector('[name="entry.1235461846"]');
  const telInput = form.querySelector('[name="entry.997380913"]');
  const textInput = form.querySelector('[name="entry.375971833"]');
  const radioGroup = form.querySelector('.radio-group');
  const radioName = 'entry.322163402';

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telRe = /^[0-9+\-()\s]{8,}$/;

  function showFormMessage(type, text) {
    msgBox.className = '';
    msgBox.classList.add(type === 'success' ? 'success' : 'error');
    msgBox.textContent = text;
  }
  function clearFormMessage() {
    msgBox.className = 'hidden';
    msgBox.textContent = '';
  }
  function setError(elOrGroup, message) {
    const old = elOrGroup.parentElement.querySelector('.error-text');
    if (old) old.remove();
    elOrGroup.classList.add('is-error');
    const p = document.createElement('div');
    p.className = 'error-text';
    p.textContent = message;
    elOrGroup.parentElement.appendChild(p);
  }
  function clearError(elOrGroup) {
    elOrGroup.classList.remove('is-error');
    const old = elOrGroup.parentElement.querySelector('.error-text');
    if (old) old.remove();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearFormMessage();

    [nameInput, addrInput, emailInput, telInput, textInput].forEach((el) => el && clearError(el));
    if (radioGroup) clearError(radioGroup);

    let valid = true;
    let firstErrorEl = null;

    const checkedRadio = form.querySelector(`input[name="${radioName}"]:checked`);
    if (!checkedRadio) {
      valid = false;
      if (radioGroup) {
        setError(radioGroup, 'お問い合わせ種類を選択してください。');
        firstErrorEl = firstErrorEl || radioGroup;
      }
    }

    if (!nameInput.value.trim()) {
      valid = false;
      setError(nameInput, 'お名前を入力してください。');
      firstErrorEl = firstErrorEl || nameInput;
    }
    if (!addrInput.value.trim()) {
      valid = false;
      setError(addrInput, 'ご住所を入力してください。');
      firstErrorEl = firstErrorEl || addrInput;
    }

    if (!emailInput.value.trim()) {
      valid = false;
      setError(emailInput, 'メールアドレスを入力してください。');
      firstErrorEl = firstErrorEl || emailInput;
    } else if (!emailRe.test(emailInput.value.trim())) {
      valid = false;
      setError(emailInput, 'メールアドレスの形式が正しくありません。');
      firstErrorEl = firstErrorEl || emailInput;
    }

    if (!telInput.value.trim()) {
      valid = false;
      setError(telInput, '電話番号を入力してください。');
      firstErrorEl = firstErrorEl || telInput;
    } else if (!telRe.test(telInput.value.trim())) {
      valid = false;
      setError(telInput, '電話番号の形式が正しくありません。');
      firstErrorEl = firstErrorEl || telInput;
    }

    if (!textInput.value.trim()) {
      valid = false;
      setError(textInput, 'お問い合わせ内容を入力してください。');
      firstErrorEl = firstErrorEl || textInput;
    }

    if (!valid) {
      showFormMessage(
        'error',
        '未入力または形式不正の項目があります。赤枠の箇所をご確認ください。'
      );
      if (firstErrorEl) firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中...';
    }

    const onLoaded = function () {
      iframe.removeEventListener('load', onLoaded);

      form.innerHTML = `
    <div class="form-complete">
      <p class="form-complete__title">送信が完了しました</p>
      <p class="form-complete__text">
        お問い合わせいただき、ありがとうございます。<br>
        内容を確認のうえ、折り返しご連絡いたします。
      </p>
    </div>
  `;
    };
    iframe.addEventListener('load', onLoaded);

    form.submit(); // ← hidden_iframe に送信
  });
})();

// ==============================
// ハンバーガーメニュー開閉（スマホ用）
// ==============================
$('#hamburger').on('click', function () {
  $(this).toggleClass('active'); // アイコン変化
  $('#mobileNav').toggleClass('active'); // メニュー開閉
  // 背景スクロール抑止（任意）
  const active = $('#mobileNav').hasClass('active');
  $('body').css('overflow', active ? 'hidden' : '');
});

// メニュー内リンクをクリックしたら閉じる + スクロール
$('#mobileNav a[href^="#"]').on('click', function (e) {
  e.preventDefault();

  const speed = 500;
  const headerHeight = $('.main_header').outerHeight() || 0; // 無ければ0
  const $target = $(this.hash === '#' || this.hash === '' ? 'html' : this.hash);
  if ($target.length) {
    const position = $target.offset().top - headerHeight;
    $('html, body').animate({ scrollTop: position }, speed, 'swing');
  }

  // 閉じる
  $('#hamburger').removeClass('active');
  $('#mobileNav').removeClass('active');
  $('body').css('overflow', '');
});

// ==============================
// スムーススクロール（通常の#リンクも対応）
// ==============================
$('a[href^="#"]').on('click', function (e) {
  // モバイルナビ内リンクは↑で処理しているので二重実行回避
  if ($(this).closest('#mobileNav').length) return;

  e.preventDefault();
  const speed = 500;
  const headerHeight = $('.main_header').outerHeight() || 0;
  const $target = $(this.hash === '#' || this.hash === '' ? 'html' : this.hash);
  if ($target.length) {
    const position = $target.offset().top - headerHeight;
    $('html, body').animate({ scrollTop: position }, speed, 'swing');
  }
});

// ==============================
// FAQ アコーディオン
// ==============================
$('.accordion-answer').each(function () {
  $(this).removeClass('open').css('max-height', '0');
});

$('.question-list')
  .off('click')
  .on('click', function () {
    const $question = $(this);
    const $answer = $question.next('.accordion-answer');
    const isOpen = $answer.hasClass('open');

    if (isOpen) {
      // 今の高さを一度固定
      $answer.css('max-height', $answer.prop('scrollHeight') + 'px');

      // 次の描画で閉じる
      requestAnimationFrame(() => {
        $answer.css('max-height', '0');
        $answer.removeClass('open');
        $question.removeClass('open');
      });
    } else {
      $answer.addClass('open');
      $question.addClass('open');

      // 開く高さを指定
      $answer.css('max-height', $answer.prop('scrollHeight') + 'px');
    }
  });

$(window).on('resize', function () {
  $('.accordion-answer.open').each(function () {
    $(this).css('max-height', $(this).prop('scrollHeight') + 'px');
  });
});
