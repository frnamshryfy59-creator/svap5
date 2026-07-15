async function loadGallery() {
    const grid = document.getElementById('gallery-grid');

    if (!isSupabaseConfigured()) {
        grid.innerHTML = '<div class="placeholder-box">اتصال Supabase هنوز تنظیم نشده است (فایل js/supabase-client.js را بررسی کنید).</div>';
        return;
    }

    const data = await supabaseSelect('gallery');
    if (!data || data.length === 0) {
        grid.innerHTML = '<div class="placeholder-box">تصویری یافت نشد.</div>';
        return;
    }

    grid.innerHTML = data.map(g => `
        <div class="gallery-item">
            <img src="${g.image_url}" alt="${g.title || 'تصویر روستا'}">
            <div class="caption">
                ${g.title || ''}
                ${g.category ? `<div class="cat-badge">${g.category}</div>` : ''}
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', loadGallery);
