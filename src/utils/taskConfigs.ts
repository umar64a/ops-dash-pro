import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faClipboardList,
  faCircleCheck,
  faClock,
  faArrowDown,
  faEquals,
  faArrowUp,
} from '@fortawesome/free-solid-svg-icons';
export const statusConfig: Record<string, { icon: IconDefinition; class: string }> = {
  todo: {
    icon: faClipboardList,
    class: 'todo-i',
  },
  'in-progress': {
    icon: faClock,
    class: 'progress-i',
  },
  done: {
    icon: faCircleCheck,
    class: 'done-i',
  },
};
export const priorityConfig: Record<string, { icon: IconDefinition; class: string }> = {
  low: {
    icon: faArrowDown,
    class: 'low-i',
  },
  medium: {
    icon: faEquals,
    class: 'medium-i',
  },
  high: {
    icon: faArrowUp,
    class: 'high-i',
  },
};