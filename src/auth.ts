export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function getUser(): { id: number; name: string; role: string } | null {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function isLoggedIn(): boolean {
  return !!getToken()
}