import { type ClassValue, clsx } from 'clsx';
import { formatDuration, intervalToDuration } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date: Date) {
  if (date < new Date()) {
    const duration = intervalToDuration({ end: new Date(), start: date });
    const durationString = formatDuration(duration, {
      format: ['years', 'months', 'days', 'hours', 'minutes'],
      delimiter: ', ',
    });
    return `Overdue: ${durationString}`;
  }
  const duration = intervalToDuration({ start: new Date(), end: date });
  return formatDuration(duration, {
    format: ['years', 'months', 'days', 'hours', 'minutes'],
    delimiter: ', ',
  });
}
