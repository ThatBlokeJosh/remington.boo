const LANGUAGE_KEY = "lang"

export function LoadLS(): string | null {
  return localStorage.getItem(LANGUAGE_KEY)
}

export function SaveLS(language: string) {
  localStorage.setItem(LANGUAGE_KEY, language)
}
