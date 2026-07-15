const SUPABASE_URL = 'https://mqdrqkucadkypyiglgic.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_03gzca8SwmtCTs84YerXrw_nCUprvU8';

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
