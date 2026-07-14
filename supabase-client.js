const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

async function supabaseSelect(table, query = '') {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*${query}`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        if (!res.ok) throw new Error('خطا در دریافت داده: ' + res.status);
        return await res.json();
    } catch (err) {
        console.error(`خطا در خواندن جدول ${table}:`, err);
        return null;
    }
}

async function supabaseInsert(table, payload) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
    });
    return res;
}

function isSupabaseConfigured() {
    return !SUPABASE_URL.includes('YOUR_SUPABASE');
}
