import { THEME_COLORS } from '../config/theme.config';

export function applyTheme(document: Document): void {
  for (const [name, color] of Object.entries(THEME_COLORS)) {
    document.documentElement.style.setProperty('--color-' + name, color);
  }
}
