import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.supabaseKey

  if (!supabaseUrl || !supabaseKey) {
    return { status: 'error', message: 'Missing SUPABASE_URL or SUPABASE_KEY in env' }
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        fetch: (url, options) => fetch(url, { ...options, signal: AbortSignal.timeout(30000) })
      }
    })

    // Query existing tables
    const [events, news, profiles, roles] = await Promise.all([
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('news').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('roles').select('*', { count: 'exact', head: true })
    ])

    return {
      status: 'connected',
      message: 'Supabase connection successful',
      supabaseUrl,
      tables: {
        events: { count: events.count, error: events.error?.message || null },
        news: { count: news.count, error: news.error?.message || null },
        profiles: { count: profiles.count, error: profiles.error?.message || null },
        roles: { count: roles.count, error: roles.error?.message || null }
      }
    }
  } catch (err: any) {
    return {
      status: 'error',
      message: err.message,
      cause: err.cause?.message || String(err.cause)
    }
  }
})
