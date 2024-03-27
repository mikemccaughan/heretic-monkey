import { Observable, Subscriber } from 'rxjs';

const formatOptions: Intl.DateTimeFormatOptions = {
  hour12: false,
  hourCycle: 'h23',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'UTC'
};
// Note: Can't use en-US because the browser may use the hourCycle defined for that locale (h24)
// despite specifically setting it to h23 above. Using en-GB because it works...
const formatter = new Intl.DateTimeFormat('en-GB', formatOptions);

export const timer = new Observable<string>((observer: Subscriber<string>) => {
  const start = Date.now();
  const id: number = window.setInterval(() => {
    const stop = Date.now();
    const elapsed = stop - start;
    const dateElapsed = new Date(elapsed);
    observer.next(formatter.format(dateElapsed));
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
