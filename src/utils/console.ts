const MESSAGE_FORMAT = 'color: blue; font-size: larger';

export const printWelcomeMessage = () => {
  console.log('%c欢迎使用 Learn Helper！', MESSAGE_FORMAT);
  console.log('%c诚邀一起参与开发工作，详见 GitHub Harry-Chen/Learn-Helper', MESSAGE_FORMAT);
};
