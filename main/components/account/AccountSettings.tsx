"use client"
import React, {useEffect, useState} from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type TabKey =
  | 'profile'
  | 'password'
  | 'sessions'
  | 'social'
  | 'passkeys'
  | 'danger'

const ENDPOINTS = {
  updateUser: '/api/auth/update-user',
  changePassword: '/api/auth/change-password',
  changeEmail: '/api/auth/change-email',
  listSessions: '/api/auth/list-sessions',
  social: '/api/auth/social',
  getSession: '/api/auth/get-session',
  passkeysList: '/api/auth/passkey/list-user-passkeys',
  passkeyAdd: '/api/auth/passkey/add-passkey',
  passkeyDelete: '/api/auth/passkey/delete-passkey',
  passkeyUpdate: '/api/auth/passkey/update-passkey',
  deleteUser: '/api/auth/delete-user',
}

export default function AccountSettings() {

  // Profile
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profileMsg, setProfileMsg] = useState<string | null>(null)
  const [rawSessionData, setRawSessionData] = useState<any>(null)

  // Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null)

  // Sessions
  const [sessions, setSessions] = useState<any[]>([])
  const [sessionsMsg, setSessionsMsg] = useState<string | null>(null)

  // Social
  const [linkedProviders, setLinkedProviders] = useState<string[]>([])
  const [socialMsg, setSocialMsg] = useState<string | null>(null)

  // Passkeys
  const [passkeys, setPasskeys] = useState<any[]>([])
  const [passkeysMsg, setPasskeysMsg] = useState<string | null>(null)

  useEffect(() => {
    // Load initial session & user info (single endpoint) — best-effort
    fetch(ENDPOINTS.getSession, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        setRawSessionData(d)
        // Support multiple possible shapes from server
        const user = d?.user || d || {}
        setUsername(user?.username ?? user?.user_name ?? user?.login ?? '')
        setName(user?.name ?? user?.fullName ?? '')
        setEmail(user?.email ?? '')

        // Try several common keys for sessions
        const sessionsFrom = d?.sessions || d?.session || user?.sessions || user?.session || d?.sessionsList || d?.sessions_list || []
        setSessions(Array.isArray(sessionsFrom) ? sessionsFrom : [])

        const providersFrom = d?.providers || d?.linkedProviders || d?.provider_list || user?.providers || []
        setLinkedProviders(Array.isArray(providersFrom) ? providersFrom : [])

        const passkeysFrom = d?.passkeys || user?.passkeys || d?.passkeyList || []
        setPasskeys(Array.isArray(passkeysFrom) ? passkeysFrom : [])
      })
      .catch((err) => {
        console.error('get-session error', err)
      })
  }, [])

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    setProfileMsg(null)
    try {
      const res = await fetch(ENDPOINTS.updateUser, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, name, email}),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.message || 'Failed')
      setProfileMsg('Saved')
    } catch (err: any) {
      setProfileMsg(err?.message || 'Error')
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordMsg(null)
    try {
      const res = await fetch(ENDPOINTS.changePassword, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({currentPassword, newPassword}),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.message || 'Failed')
      setPasswordMsg('Password updated')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err: any) {
      setPasswordMsg(err?.message || 'Error')
    }
  }

  async function handleRevokeSession(sessionId: string) {
    setSessionsMsg(null)
    try {
      const res = await fetch(`${ENDPOINTS.listSessions}/revoke`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: sessionId}),
      })
      if (!res.ok) throw new Error('Failed')
      setSessions((s) => s.filter((x) => x.id !== sessionId))
      setSessionsMsg('Revoked')
    } catch (err: any) {
      setSessionsMsg(err?.message || 'Error')
    }
  }

  async function handleLinkProvider(provider: string) {
    setSocialMsg(null)
    try {
      // Implementation depends on your auth provider flow — placeholder
      const res = await fetch(`${ENDPOINTS.social}/link`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({provider}),
      })
      if (!res.ok) throw new Error('Failed to link')
      setLinkedProviders((p) => Array.from(new Set([...p, provider])))
      setSocialMsg('Linked')
    } catch (err: any) {
      setSocialMsg(err?.message || 'Error')
    }
  }

  async function handleUnlinkProvider(provider: string) {
    setSocialMsg(null)
    try {
      const res = await fetch(`${ENDPOINTS.social}/unlink`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({provider}),
      })
      if (!res.ok) throw new Error('Failed to unlink')
      setLinkedProviders((p) => p.filter((x) => x !== provider))
      setSocialMsg('Unlinked')
    } catch (err: any) {
      setSocialMsg(err?.message || 'Error')
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('Delete your account? This cannot be undone.')) return
    try {
      const res = await fetch(ENDPOINTS.deleteUser, {method: 'POST'})
      if (!res.ok) throw new Error('Failed')
      // Redirect or show a message — keep simple
      alert('Account deleted')
    } catch (err: any) {
      alert(err?.message || 'Error')
    }
  }

  return (
    <div className="w-full py-8">
      <Tabs defaultValue="profile" orientation="vertical" className="flex gap-8 items-start">
        <TabsList className="w-60 flex-col p-2 rounded-lg" aria-orientation="vertical">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        <TabsTrigger value="social">Social Accounts</TabsTrigger>
        <TabsTrigger value="passkeys">Passkeys</TabsTrigger>
        <TabsTrigger value="danger" className="text-destructive">Delete Account</TabsTrigger>
      </TabsList>

        <div className="flex-1">
          <div className="space-y-6">
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="grid gap-4 max-w-2xl">
                <div className="flex flex-col gap-2">
                  <Label>Username</Label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex items-center gap-3">
                  <Button type="submit">Save</Button>
                  {profileMsg && <span className="text-sm text-muted-foreground">{profileMsg}</span>}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="grid gap-4 max-w-xl">
                <div className="flex flex-col gap-2">
                  <Label>Current password</Label>
                  <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>New password</Label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="flex items-center gap-3">
                  <Button type="submit">Update password</Button>
                  {passwordMsg && <span className="text-sm text-muted-foreground">{passwordMsg}</span>}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Sessions</CardTitle>
            </CardHeader>
            <CardContent>
                  {sessionsMsg && <div className="mb-2 text-sm text-muted-foreground">{sessionsMsg}</div>}
                  <div className="space-y-3">
                    {sessions.length === 0 && <div className="text-sm text-muted-foreground">No active sessions found.</div>}
                    {sessions.length === 0 && rawSessionData && (
                      <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-muted p-2 text-xs">{JSON.stringify(rawSessionData, null, 2)}</pre>
                    )}
                {sessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <div className="font-medium">{s.device || s.userAgent || 'Unknown device'}</div>
                      <div className="text-sm text-muted-foreground">{s.lastSeen || s.createdAt}</div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" onClick={() => handleRevokeSession(s.id)}>Revoke</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              {socialMsg && <div className="mb-2 text-sm text-muted-foreground">{socialMsg}</div>}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="mb-2 font-medium">Linked</h3>
                  <div className="space-y-2">
                    {linkedProviders.length === 0 && <div className="text-sm text-muted-foreground">None linked</div>}
                    {linkedProviders.map((p) => (
                      <div key={p} className="flex items-center justify-between">
                        <div>{p}</div>
                        <Button variant="ghost" size="sm" onClick={() => handleUnlinkProvider(p)}>Unlink</Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Link Provider</h3>
                  <div className="flex gap-3">
                    <Button onClick={() => handleLinkProvider('github')}>Link GitHub</Button>
                    <Button variant="outline" onClick={() => handleLinkProvider('google')}>Link Google</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="passkeys">
          <Card>
            <CardHeader>
              <CardTitle>Passkeys</CardTitle>
            </CardHeader>
            <CardContent>
              {passkeysMsg && <div className="mb-2 text-sm text-muted-foreground">{passkeysMsg}</div>}
              <div className="space-y-3">
                {passkeys.length === 0 && <div className="text-sm text-muted-foreground">No passkeys registered.</div>}
                {passkeys.map((pk) => (
                  <div key={pk.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <div className="font-medium">{pk.name || pk.id}</div>
                      <div className="text-sm text-muted-foreground">{pk.createdAt}</div>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm" onClick={() => alert('Remove passkey flow not implemented')}>Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button onClick={() => alert('Create passkey flow not implemented')}>Register Passkey</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger">
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Delete Account</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">This will permanently delete your account and all data. This action is irreversible.</p>
              <div className="mt-4">
                <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
