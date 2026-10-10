// 스토리 args의 fn()과 play 함수용 대체 구현. 갤러리에서는 호출 기록이 필요 없다.
export const fn =
  <T extends (...args: never[]) => unknown>(impl?: T) =>
  (...args: Parameters<T>) =>
    impl?.(...args);

const noop = async () => {};
export const expect = () => new Proxy({}, { get: () => noop });
export const userEvent = new Proxy({}, { get: () => noop });
export const waitFor = noop;
