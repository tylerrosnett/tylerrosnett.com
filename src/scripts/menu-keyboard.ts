export interface MenuKeyOptions {
  onEscape?: () => void;
}

export function createMenuKeyHandler(
  items: HTMLElement[],
  options: MenuKeyOptions = {},
): (event: KeyboardEvent) => void {
  return (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const idx = items.indexOf(target);
    if (idx === -1) return;
    const last = items.length - 1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        items[(idx + 1) % items.length]?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        items[(idx - 1 + items.length) % items.length]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        items[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        items[last]?.focus();
        break;
      case 'Tab':
        if (event.shiftKey && idx === 0) {
          event.preventDefault();
          items[last]?.focus();
        } else if (!event.shiftKey && idx === last) {
          event.preventDefault();
          items[0]?.focus();
        }
        break;
      case 'Escape':
        if (options.onEscape) {
          event.preventDefault();
          options.onEscape();
        }
        break;
    }
  };
}
