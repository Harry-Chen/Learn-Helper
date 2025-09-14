import { storeCredential } from '../src/utils/auth';
import { sendMessage } from '../src/utils/finger';

export default defineContentScript({
  matches: ['https://id.tsinghua.edu.cn/do/off/ui/auth/login/*'],
  async main(_ctx) {
    const form = document.querySelector<HTMLFormElement>('#theform');
    if (!form) return;
    const btn = form.querySelector<HTMLAnchorElement>('a.btn');
    if (!btn) return;

    try {
      const finger = form.querySelector<HTMLInputElement>('#fingerPrint')!.value;
      await sendMessage('sendFinger', finger);
      close();
    } catch (_e) {}

    let label: string;
    let hint: string;
    if (btn.innerText.includes('登录')) {
      label = '启用 Learn Helper 自动登录 (?)';
      hint = '在 Learn Helper 中保存本次登录信息，打开 Learn Helper 时即可自动登录';
    } else {
      label = 'Enable Learn Helper auto login (?)';
      hint = 'Save current credentials in Learn Helper for auto login';
    }

    const tmp = document.createElement('div');
    tmp.innerHTML = `<div style="display: flex; align-items: flex-start; color: #2e2e3f; text-align: left;">
        <input type="checkbox" id="helperSave" style="margin-top: 5px;">
        <span style="margin-left: 8px; line-height: 1.6;" title="${hint}">${label}</span>
      </div>`;
    form.insertBefore(tmp.firstElementChild!, form.children[3]);

    btn.addEventListener('click', async (_e) => {
      const username = form.querySelector<HTMLInputElement>('#i_user')!.value;
      const password = form.querySelector<HTMLInputElement>('#i_pass')!.value;
      const save = form.querySelector<HTMLInputElement>('#helperSave')!.checked;

      if (save) {
        await storeCredential(username, password);
        console.log('Learn Helper: Credential saved');
      }
    });
  },
});
