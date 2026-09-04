// 設定画面 (settings.js)
import { saveSettings } from '../lib/storage.js';
import { playSound } from '../lib/sound.js';

export function renderSettings(root, { settings }) {
  function render() {
    root.innerHTML = `
      <section class="card" style="max-width: 680px; margin: 0 auto;">
        <h2 style="font-size: var(--text-xl); color: var(--c-ink); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
          ⚙️ 設定（せってい）
        </h2>

        <div class="settings-list">
          <!-- 漢字レベル -->
          <div class="setting-row">
            <div class="setting-info">
              <h3>ひらがな・漢字の表示</h3>
              <p>お子さまの学年に合わせて 文字の表記を変えられます</p>
            </div>
            <select id="selectKanjiLevel" style="padding: 8px 12px; font-size: 15px; border-radius: 8px; border: 2px solid var(--c-rule); font-weight: bold;">
              <option value="kana" ${settings.kanjiLevel === 'kana' ? 'selected' : ''}>小学2年（ひらがな中心）</option>
              <option value="grade3" ${settings.kanjiLevel === 'grade3' ? 'selected' : ''}>小学3年（ならう漢字）</option>
              <option value="adult" ${settings.kanjiLevel === 'adult' ? 'selected' : ''}>一般（漢字まじり）</option>
            </select>
          </div>

          <!-- ふりがな -->
          <div class="setting-row">
            <div class="setting-info">
              <h3>ふりがな（ルビ）を表示</h3>
              <p>難しい漢字に ふりがなを つけます</p>
            </div>
            <label style="cursor: pointer;">
              <input type="checkbox" id="checkRuby" ${settings.ruby ? 'checked' : ''} style="transform: scale(1.4);">
            </label>
          </div>

          <!-- 効果音 -->
          <div class="setting-row">
            <div class="setting-info">
              <h3>効果音（サウンド）</h3>
              <p>水を注ぐ音や 正解時のピンポン音を 鳴らします</p>
            </div>
            <label style="cursor: pointer;">
              <input type="checkbox" id="checkSound" ${settings.sound ? 'checked' : ''} style="transform: scale(1.4);">
            </label>
          </div>

          <!-- 保存通知 & リセット -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; border-top: 2px solid var(--c-rule-soft); padding-top: 16px;">
            <div id="saveNotice" style="color: var(--c-correct); font-weight: bold; font-size: 14px; display: none;">
              ✅ 設定を保存しました
            </div>
            <button id="btnResetSettings" class="btn btn-outline" style="min-height: 40px; font-size: 13px; margin-left: auto;">
              初期設定にもどす
            </button>
          </div>
        </div>
      </section>
    `;

    bindEvents();
  }

  function showSaved() {
    const el = root.querySelector('#saveNotice');
    if (el) {
      el.style.display = 'block';
      setTimeout(() => { if (el) el.style.display = 'none'; }, 2000);
    }
  }

  function bindEvents() {
    const kanjiSelect = root.querySelector('#selectKanjiLevel');
    if (kanjiSelect) {
      kanjiSelect.addEventListener('change', (e) => {
        settings.kanjiLevel = e.target.value;
        saveSettings(settings);
        playSound('click', settings.sound);
        showSaved();
      });
    }

    const checkRuby = root.querySelector('#checkRuby');
    if (checkRuby) {
      checkRuby.addEventListener('change', (e) => {
        settings.ruby = e.target.checked;
        saveSettings(settings);
        playSound('click', settings.sound);
        showSaved();
      });
    }

    const checkSound = root.querySelector('#checkSound');
    if (checkSound) {
      checkSound.addEventListener('change', (e) => {
        settings.sound = e.target.checked;
        saveSettings(settings);
        playSound('click', settings.sound);
        showSaved();
      });
    }

    const resetBtn = root.querySelector('#btnResetSettings');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('設定を初期状態にもどしますか？')) {
          localStorage.removeItem('kasa_app_settings');
          location.reload();
        }
      });
    }
  }

  render();

  return () => {};
}
