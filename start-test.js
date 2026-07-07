const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const server = spawn('node', ['src/index.js'], { stdio: 'pipe', shell: true, cwd: __dirname });
let output = '';
server.stdout.on('data', d => { output += d; });
server.stderr.on('data', d => { output += d; });

setTimeout(() => {
  console.log('Server output:', output);
  http.get('http://localhost:3000/api', res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      console.log('API response:', data);
      // Test login
      const postData = JSON.stringify({ username: 'paciente1', password: 'Paciente1!' });
      const req = http.request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
      }, res2 => {
        let d2 = '';
        res2.on('data', c => d2 += c);
        res2.on('end', () => {
          console.log('Login response:', d2);
          console.log('Set-Cookie:', res2.headers['set-cookie']);
          server.kill();
          process.exit(0);
        });
      });
      req.write(postData);
      req.end();
    });
  }).on('error', e => { console.log('Error:', e.message); server.kill(); process.exit(1); });
}, 4000);
