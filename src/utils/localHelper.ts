export function setLocalTheme(data: string): any {
    localStorage.setItem('theme', data);
}

export function getLocalTheme(): any {
    return localStorage.getItem('theme');
}