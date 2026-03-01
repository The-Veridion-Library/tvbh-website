import AccountSettings from '@/components/account/AccountSettings'

export const metadata = {
  title: 'Account Settings',
}

export default function Page() {
  return (
    <main className="w-full">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold mb-6">Account</h1>
        <AccountSettings />
      </div>
    </main>
  )
}
