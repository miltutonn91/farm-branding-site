// ★ ローディング非表示処理（バニラJS）
window.addEventListener('load', function () {
  const loading = document.getElementById('loading');
  setTimeout(() => {
    loading.classList.add('fade-out');
  }, 1500); // 1.5秒後にフェードアウト
});

// スライド
(function ensurePlentySlides(){
  const wrapper = document.querySelector('.product .swiper-wrapper');
  if (!wrapper) return;

  const originals = Array.from(wrapper.children);
  const MIN = 100; 

  while (wrapper.children.length < MIN) {
    for (const node of originals) {
      const clone = node.cloneNode(true);
      clone.removeAttribute('id'); // id重複防止
      wrapper.appendChild(clone);
      if (wrapper.children.length >= MIN) break;
    }
  }
})();


// Swiper 初期化
const swiper = new Swiper('.product .product-slider', {
  slidesPerView: 'auto',   // ← 常に auto にする（固定幅はCSSで管理）
  spaceBetween: 24,
  loop: true,
  speed: 200,
  centeredSlides: false,

  navigation: {
    nextEl: '.product .swiper-button-next',
    prevEl: '.product .swiper-button-prev',
  },

  breakpoints: {
    0: {   // スマホでもカード幅はCSS固定なので 1 枚ずつ見える
      slidesPerView: 1.2,
      centeredSlides: true,   // 中央に配置
      spaceBetween: 16,
    },
    769: { 
      // PC
      slidesPerView: 'auto',
      centeredSlides: false,
      spaceBetween: 24,
    },
  },

  loopedSlides: 50,
  loopAdditionalSlides: 50,
  loopedSlidesLimit: false,
  watchOverflow: false,
  loopPreventsSliding: true, // ← 左矢印でガクつきやすい場合ON

  resistanceRatio: 0,
  roundLengths: true,
  preloadImages: true,
  watchSlidesProgress: true,
  observer: true,
  observeParents: true,
  updateOnWindowResize: true,
});


// お問い合わせフォーム

(function(){
  const form   = document.getElementById('contactForm');
  if (!form) return;

  const msgBox = document.getElementById('formMessage');
  const iframe = document.getElementById('hidden_iframe');

  const nameInput   = form.querySelector('[name="entry.1425804916"]');
  const addrInput   = form.querySelector('[name="entry.1129032173"]');
  const emailInput  = form.querySelector('[name="entry.1235461846"]');
  const telInput    = form.querySelector('[name="entry.997380913"]');
  const textInput   = form.querySelector('[name="entry.375971833"]');
  const radioGroup  = form.querySelector('.radio-group');
  const radioName   = 'entry.322163402';

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telRe   = /^[0-9+\-()\s]{8,}$/;

  function showFormMessage(type, text){
    msgBox.className = '';
    msgBox.classList.add(type === 'success' ? 'success' : 'error');
    msgBox.textContent = text;
  }
  function clearFormMessage(){
    msgBox.className = 'hidden';
    msgBox.textContent = '';
  }
  function setError(elOrGroup, message){
    const old = elOrGroup.parentElement.querySelector('.error-text');
    if(old) old.remove();
    elOrGroup.classList.add('is-error');
    const p = document.createElement('div');
    p.className = 'error-text';
    p.textContent = message;
    elOrGroup.parentElement.appendChild(p);
  }
  function clearError(elOrGroup){
    elOrGroup.classList.remove('is-error');
    const old = elOrGroup.parentElement.querySelector('.error-text');
    if(old) old.remove();
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    clearFormMessage();

    [nameInput, addrInput, emailInput, telInput, textInput].forEach(el => el && clearError(el));
    if (radioGroup) clearError(radioGroup);

    let valid = true;
    let firstErrorEl = null;

    const checkedRadio = form.querySelector(`input[name="${radioName}"]:checked`);
    if(!checkedRadio){ valid = false; if (radioGroup){ setError(radioGroup,'お問い合わせ種類を選択してください。'); firstErrorEl = firstErrorEl || radioGroup; } }

    if(!nameInput.value.trim()){ valid=false; setError(nameInput,'お名前を入力してください。'); firstErrorEl = firstErrorEl || nameInput; }
    if(!addrInput.value.trim()){ valid=false; setError(addrInput,'ご住所を入力してください。'); firstErrorEl = firstErrorEl || addrInput; }

    if(!emailInput.value.trim()){ valid=false; setError(emailInput,'メールアドレスを入力してください。'); firstErrorEl = firstErrorEl || emailInput; }
    else if(!emailRe.test(emailInput.value.trim())){ valid=false; setError(emailInput,'メールアドレスの形式が正しくありません。'); firstErrorEl = firstErrorEl || emailInput; }

    if(!telInput.value.trim()){ valid=false; setError(telInput,'電話番号を入力してください。'); firstErrorEl = firstErrorEl || telInput; }
    else if(!telRe.test(telInput.value.trim())){ valid=false; setError(telInput,'電話番号の形式が正しくありません。'); firstErrorEl = firstErrorEl || telInput; }

    if(!textInput.value.trim()){ valid=false; setError(textInput,'お問い合わせ内容を入力してください。'); firstErrorEl = firstErrorEl || textInput; }

    if(!valid){
      showFormMessage('error','未入力または形式不正の項目があります。赤枠の箇所をご確認ください。');
      if (firstErrorEl) firstErrorEl.scrollIntoView({ behavior:'smooth', block:'center' });
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn){ submitBtn.disabled = true; submitBtn.textContent = '送信中...'; }

    const onLoaded = function(){
      iframe.removeEventListener('load', onLoaded);
      if (submitBtn){ submitBtn.disabled = false; submitBtn.textContent = '送信する'; }
      form.reset();
      [nameInput, addrInput, emailInput, telInput, textInput].forEach(el => el && clearError(el));
      if (radioGroup) clearError(radioGroup);
      showFormMessage('success','送信が完了しました。ありがとうございます！');
    };
    iframe.addEventListener('load', onLoaded);

    form.submit(); // ← hidden_iframe に送信
  });
})();


  // ==============================
  // ハンバーガーメニュー開閉（スマホ用）
  // ==============================
  $('#hamburger').on('click', function () {
    $(this).toggleClass('active');          // アイコン変化
    $('#mobileNav').toggleClass('active');  // メニュー開閉
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
  // FAQ アコーディオン（初期は閉じる）
  // ==============================
  $('.accordion-answer').each(function(){
    $(this).removeClass('open').css('max-height', '0');
  });

$('.question-list').off('click').on('click', function () {
  const $answer = $(this).next('.accordion-answer'); // ← 直後の答えだけ取る
  const isOpen = $answer.hasClass('open');

  if (isOpen) {
    $answer.removeClass('open').css('max-height', '0');
    $(this).removeClass('open');
  } else {
    const h = $answer.prop('scrollHeight');
    $answer.addClass('open').css('max-height', h + 'px');
    $(this).addClass('open');
  }
});


  // リサイズ時：開いている答えの高さを再計算
  $(window).on('resize', function(){
    $('.accordion-answer.open').each(function(){
      $(this).css('max-height', $(this).prop('scrollHeight') + 'px');
    });
  });

