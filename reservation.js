let accommodationsList = [];

async function loadAccommodations() {
    const grid = document.getElementById('accommodations-grid');
    const select = document.getElementById('r-accommodation');

    if (!isSupabaseConfigured()) {
        grid.innerHTML = '<div class="placeholder-box">اتصال Supabase هنوز تنظیم نشده است (فایل js/supabase-client.js را بررسی کنید).</div>';
        return;
    }

    const data = await supabaseSelect('accommodations');
    if (!data || data.length === 0) {
        grid.innerHTML = '<div class="placeholder-box">اقامتگاهی یافت نشد.</div>';
        return;
    }

    accommodationsList = data;

    grid.innerHTML = data.map(a => `
        <div class="card acc-card">
            <img src="${a.image_url}" alt="${a.name}">
            <div class="acc-body">
                <h3>${a.name}</h3>
                <p>${a.description || ''}</p>
                <span class="acc-capacity">ظرفیت: ${a.capacity} نفر</span>
                <span class="acc-price">هر شب از ${Number(a.price_per_night).toLocaleString('fa-IR')} تومان</span>
                <button class="btn" onclick="selectAccommodation('${a.name.replace(/'/g, "\\'")}')">رزرو این اقامتگاه</button>
            </div>
        </div>
    `).join('');

    select.innerHTML = data.map(a => `<option value="${a.name}">${a.name}</option>`).join('');
}

function selectAccommodation(name) {
    document.getElementById('r-accommodation').value = name;
    document.getElementById('reservation-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.getElementById('reservation-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const msgBox = document.getElementById('form-msg');
    const btn = document.getElementById('submit-btn');

    const checkin = document.getElementById('r-checkin').value;
    const checkout = document.getElementById('r-checkout').value;
    if (checkout <= checkin) {
        msgBox.className = 'form-msg err';
        msgBox.textContent = 'تاریخ خروج باید بعد از تاریخ ورود باشد.';
        return;
    }

    if (!isSupabaseConfigured()) {
        msgBox.className = 'form-msg err';
        msgBox.textContent = 'اتصال دیتابیس هنوز تنظیم نشده است.';
        return;
    }

    const payload = {
        full_name: document.getElementById('r-name').value,
        phone_number: document.getElementById('r-phone').value,
        accommodation_name: document.getElementById('r-accommodation').value,
        check_in: checkin,
        check_out: checkout,
        guests_count: parseInt(document.getElementById('r-guests').value, 10),
        status: 'در انتظار تایید'
    };

    btn.disabled = true;
    btn.textContent = 'در حال ارسال...';

    try {
        const res = await supabaseInsert('reservations', payload);
        if (res.ok) {
            msgBox.className = 'form-msg ok';
            msgBox.textContent = 'درخواست رزرو شما با موفقیت ثبت شد. به‌زودی با شما تماس گرفته می‌شود.';
            e.target.reset();
        } else {
            msgBox.className = 'form-msg err';
            msgBox.textContent = 'خطا در ثبت رزرو. لطفاً دوباره تلاش کنید.';
        }
    } catch (err) {
        msgBox.className = 'form-msg err';
        msgBox.textContent = 'خطا در برقراری ارتباط با سرور. اتصال اینترنت را بررسی کنید.';
    } finally {
        btn.disabled = false;
        btn.textContent = 'ثبت درخواست رزرو';
    }
});

document.addEventListener('DOMContentLoaded', loadAccommodations);
