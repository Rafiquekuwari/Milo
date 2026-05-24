'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    async function check() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/auth')
        return
      }
      const { data: access } = await supabase
        .from('learner_access')
        .select('learner_id')
        .eq('parent_id', session.user.id)
        .limit(1)
      if (!access || access.length === 0) {
        router.replace('/parent')
      } else {
        router.replace('/parent')
      }
    }
    check()
  }, [router])

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#FCEAB6',
    }}>
      <img src="/assets/characters/milo-happy.png" alt="Milo"
        style={{ width: 80, height: 80, objectFit: 'contain',
          animation: 'bounce 1s ease-in-out infinite' }} />
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
    </div>
  )
}