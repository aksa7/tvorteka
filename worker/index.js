export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/api/send') {
      try {
        const contentType = request.headers.get('content-type') || '';
        let data = {};
        if (contentType.includes('application/json')) {
          data = await request.json();
        } else {
          const form = await request.formData();
          for (const [key, value] of form.entries()) data[key] = value;
        }

        if (data._gotcha) {
          return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
        }

        const formType = data.formType || 'kontaktai';
        const replyTo = data.email || undefined;

        const contactFieldLabels = { vardas: 'Vardas', pavarde: 'Pavardė', telefonas: 'Telefonas', email: 'El. paštas', miestas: 'Miestas', zinute: 'Žinutė' };
        const contactRows = Object.entries(contactFieldLabels)
          .filter(([key]) => data[key])
          .map(([key, label]) => `<tr><td style="padding:6px 12px;color:#666;border-bottom:1px solid #eee;">${label}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;"><strong>${String(data[key])}</strong></td></tr>`)
          .join('');

        const configItems = Array.isArray(data.configItems) ? data.configItems : [];
        const configRows = configItems
          .map(it => `<tr><td style="padding:6px 12px;color:#666;border-bottom:1px solid #eee;">${it.label}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;"><strong>${it.value}</strong></td></tr>`)
          .join('');

        const formTypeLabel = formType === 'skaiciuokle' ? 'Skaičiuoklė' : formType === 'kontaktai' ? 'Kontaktai' : 'Pagrindinis puslapis';

        const html = `<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin:0 auto;">
     <h2 style="margin-bottom:4px;">Nauja užklausa - ${formTypeLabel}</h2>
     <h3 style="margin-top:24px; margin-bottom:8px; font-size:14px; text-transform:uppercase; color:#888;">Kontaktiniai duomenys</h3>
     <table style="width:100%; border-collapse:collapse;">${contactRows}</table>
     ${configRows ? `<h3 style="margin-top:24px; margin-bottom:8px; font-size:14px; text-transform:uppercase; color:#888;">Tvoros konfigūracija</h3><table style="width:100%; border-collapse:collapse;">${configRows}</table>` : ''}
   </div>`;

        const subject = data._subject || `Nauja užklausa (${formType}) - Tvorteka svetainė`;

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Tvorteka svetainė <svetaine@tvorteka.lt>',
            to: ['info@tvorteka.lt'],
            reply_to: replyTo,
            subject,
            html
          })
        });

        if (!resendRes.ok) {
          console.error('Resend error:', await resendRes.text());
          return new Response(JSON.stringify({ ok: false, error: 'send_failed' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
        }

        if (['skaiciuokle', 'kontaktai', 'homepage'].includes(formType) && data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
          try {
            const thankYouRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: 'Tvorteka <info@tvorteka.lt>',
                to: [data.email],
                subject: 'Gavome Jūsų užklausą – Tvorteka',
                html: `<div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">
  <h2 style="margin-bottom: 8px;">Ačiū už Jūsų užklausą!</h2>
  <p>Sveiki${data.vardas ? ', ' + data.vardas : ''},</p>
  <p>Dėkojame, kad kreipėtės į <strong>Tvorteka</strong>. Gavome Jūsų užklausą ir jau ją nagrinėjame.</p>
  <p>Mūsų darbuotojas su Jumis susisieks <strong>per 48 valandas</strong> ir pateiks individualų pasiūlymą pagal Jūsų nurodytus duomenis.</p>
  <p>Jei turite papildomų klausimų, drąsiai atsakykite į šį laišką arba skambinkite <a href="tel:+37066256657">+370 662 56657</a>.</p>
  <p style="margin-top: 24px;">Iki greito pokalbio,<br><strong>Tvorteka komanda</strong></p>
</div>`
              })
            });

            if (!thankYouRes.ok) {
              console.error('Thank-you email error:', await thankYouRes.text());
            }
          } catch (err) {
            console.error('Thank-you email error:', err);
          }
        }

        return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
      } catch (err) {
        console.error('Worker error:', err);
        return new Response(JSON.stringify({ ok: false, error: 'bad_request' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
