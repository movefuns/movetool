export function setLocalTheme(data: string): any {
    localStorage.setItem('theme', data);
}

export function getLocalTheme(): any {
    return localStorage.getItem('theme');
}


export function setLocalNetwork(data: string): any {
    localStorage.setItem('network', data);
}

export function getLocalNetwork(): any {
    return localStorage.getItem('network');
}