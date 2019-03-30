import { Observable, Subscriber } from 'rxjs';

const formatOptions: Intl.DateTimeFormatOptions = {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'UTC'
};
const format = new Intl.DateTimeFormat(undefined, formatOptions);

export const timer = new Observable<string>((observer: Subscriber<string>) => {
  const start = Date.now();
  const id: number = window.setInterval(() => {
    const stop = Date.now();
    const elapsed = stop - start;
    const dateElapsed = new Date(elapsed);
    observer.next(format.format(dateElapsed));
  }, 1000);
  return {
    unsubscribe() {
      clearInterval(id);
    }
  };
});

export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
