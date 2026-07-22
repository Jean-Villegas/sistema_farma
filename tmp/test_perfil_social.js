/**
 * Smoke test de API: login, perfil público, foros por autor, update social.
 * Uso: node tmp/test_perfil_social.js
 */
const http = require('http');

function request(method, path, body, cookie) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 3000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
          ...(cookie ? { Cookie: cookie } : {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          let json = null;
          try { json = JSON.parse(raw); } catch { json = raw; }
          const setCookie = res.headers['set-cookie'] || [];
          resolve({ status: res.statusCode, data: json, cookies: setCookie });
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function pickCookie(setCookie) {
  return setCookie.map((c) => c.split(';')[0]).join('; ');
}

(async () => {
  const results = [];
  const ok = (name, pass, detail) => {
    results.push({ name, pass, detail });
    console.log(`${pass ? 'OK' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  };

  try {
    const ping = await request('GET', '/api');
    ok('API viva', ping.status === 200, JSON.stringify(ping.data));

    const login = await request('POST', '/api/auth/login', { username: 'admin', password: 'Admin123!' });
    ok('Login admin', login.status === 200 && login.data?.usuario?.id, `status=${login.status}`);
    const cookie = pickCookie(login.cookies);
    const userId = login.data?.usuario?.id;

    if (!cookie || !userId) {
      console.log('\nNo se pudo continuar sin sesión.');
      process.exit(1);
    }

    const session = await request('GET', '/api/auth/session', null, cookie);
    ok('Sesión', session.status === 200 && session.data?.user?.id, `id=${session.data?.user?.id}`);

    const pub = await request('GET', `/api/usuarios/public/${userId}`, null, cookie);
    ok('Perfil público', pub.status === 200 && pub.data?.username, `user=${pub.data?.username}`);

    const foros = await request('GET', `/api/foros/autor/${userId}`, null, cookie);
    ok('Foros por autor', foros.status === 200 && Array.isArray(foros.data), `count=${foros.data?.length}`);

    const allForos = await request('GET', '/api/foros');
    ok('Listar foros', allForos.status === 200 && Array.isArray(allForos.data), `count=${allForos.data?.length}`);

    const upd = await request(
      'PUT',
      '/api/usuarios/profile/social',
      { bio: 'Perfil de prueba HealthHub · ' + new Date().toISOString().slice(0, 19) },
      cookie
    );
    ok('Editar perfil social', upd.status === 200, upd.data?.mensaje);

    const pub2 = await request('GET', `/api/usuarios/public/${userId}`, null, cookie);
    ok('Bio persistida', pub2.status === 200 && String(pub2.data?.bio || '').includes('Perfil de prueba'), `bio=${(pub2.data?.bio || '').slice(0, 40)}`);

    const chat = await request('GET', '/api/chat/contactos', null, cookie);
    ok('Chat contactos', chat.status === 200 && Array.isArray(chat.data), `count=${chat.data?.length}`);

    const failCedula = await request('POST', '/api/auth/register', {
      username: 'test_dup_' + Date.now(),
      password: 'Test123!',
      email: `dup_${Date.now()}@test.com`,
      cedula: '32007262',
      rol: 'Medico',
    });
    ok('Cédula duplicada controlada', failCedula.status === 400, failCedula.data?.mensaje);
  } catch (err) {
    ok('Excepción', false, err.message);
  }

  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n${results.length - failed}/${results.length} tests OK`);
  process.exit(failed ? 1 : 0);
})();
