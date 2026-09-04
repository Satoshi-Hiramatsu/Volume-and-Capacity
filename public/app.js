// メインアプリケーション エントリーポイント (ハッシュルーター)
import { loadSettings } from './lib/storage.js';
import { renderHome } from './screens/home.js';
import { renderLearn } from './screens/learn.js';
import { renderPractice } from './screens/practice.js';
import { renderPrint } from './screens/print.js';
import { renderSettings } from './screens/settings.js';

const settings = loadSettings();
const appRoot = document.getElementById('app');

const routes = {
  home: renderHome,
  learn: renderLearn,
  practice: renderPractice,
  print: renderPrint,
  settings: renderSettings,
};

let cleanup = null;

function parseHash() {
  const raw = location.hash.replace(/^#/, '');
  const [name, query = ''] = raw.split('?');
  const routeName = Object.hasOwn(routes, name) ? name : 'home';
  return {
    name: routeName,
    params: new URLSearchParams(query)
  };
}

function updateNav(activeName) {
  document.querySelectorAll('.topbar .nav-item').forEach(link => {
    const route = link.getAttribute('data-nav');
    link.classList.toggle('is-active', route === activeName);
  });
}

function render() {
  if (cleanup) {
    cleanup();
    cleanup = null;
  }

  const { name, params } = parseHash();
  document.body.dataset.route = name;
  updateNav(name);

  appRoot.replaceChildren();
  cleanup = routes[name](appRoot, { settings, params }) || null;
  window.scrollTo(0, 0);
}

// サービスワーカー登録
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(err => {
    console.log('SW registration failed:', err);
  });
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);

// すでにDOMが読み込まれている場合は即座に実行
if (document.readyState !== 'loading') {
  render();
}
