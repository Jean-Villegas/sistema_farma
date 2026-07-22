import { useEffect, useRef, useState } from 'react';
import api from '../services/api';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';
import { useAuth } from '../hooks/useAuth';
import { getInitials, formatDate } from '../utils/constants';
import Loading from './Loading';
import Alert from './Alert';

export default function Chat() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [onlineIds, setOnlineIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef(null);
  const selectedRef = useRef(null);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    let cancelled = false;
    const sock = connectSocket();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onOnline = (ids) => setOnlineIds(ids);
    const onMessage = (msg) => {
      const peer = selectedRef.current;
      if (!peer) return;
      const involves =
        (msg.emisor_id === user.id && msg.receptor_id === peer.id) ||
        (msg.emisor_id === peer.id && msg.receptor_id === user.id);
      if (involves) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    };
    const onError = (payload) => {
      setAlert({ message: payload?.mensaje || 'Error en el chat', type: 'error' });
    };

    sock.on('connect', onConnect);
    sock.on('disconnect', onDisconnect);
    sock.on('usuarios_online', onOnline);
    sock.on('nuevo_mensaje', onMessage);
    sock.on('chat_error', onError);
    if (sock.connected) setConnected(true);

    (async () => {
      try {
        const data = await api.getChatContactos();
        if (!cancelled) setContacts(Array.isArray(data) ? data : data?.contactos || []);
      } catch (err) {
        if (!cancelled) setAlert({ message: err.message, type: 'error' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      sock.off('connect', onConnect);
      sock.off('disconnect', onDisconnect);
      sock.off('usuarios_online', onOnline);
      sock.off('nuevo_mensaje', onMessage);
      sock.off('chat_error', onError);
      disconnectSocket();
    };
  }, [user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openChat = async (contact) => {
    setSelected(contact);
    setMessages([]);
    try {
      const data = await api.getChatHistorial(contact.id);
      setMessages(Array.isArray(data) ? data : data?.mensajes || []);
    } catch (err) {
      setAlert({ message: err.message, type: 'error' });
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const contenido = text.trim();
    if (!contenido || !selected) return;
    const sock = getSocket();
    if (!sock?.connected) {
      setAlert({ message: 'Sin conexión al servidor de chat', type: 'error' });
      return;
    }
    sock.emit('enviar_mensaje', { receptor_id: selected.id, contenido });
    setText('');
  };

  if (loading) return <Loading text="Cargando chat..." />;

  return (
    <div>
      <Alert message={alert?.message} type={alert?.type} onClose={() => setAlert(null)} />

      <div className="card overflow-hidden" style={{ height: 'calc(100vh - 10rem)', minHeight: 420 }}>
        <div className="flex h-full">
          <aside className="w-72 border-r border-slate-100 flex flex-col bg-slate-50/50">
            <div className="p-4 border-b border-slate-100">
              <h2 className="font-extrabold text-slate-800">
                <i className="fas fa-comments text-sky-500 mr-2" />
                Chat en vivo
              </h2>
              <p className={`text-xs mt-1 font-medium ${connected ? 'text-emerald-600' : 'text-amber-600'}`}>
                <i className={`fas fa-circle text-[8px] mr-1 align-middle`} />
                {connected ? 'Conectado' : 'Reconectando...'}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {contacts.length === 0 ? (
                <p className="p-4 text-sm text-slate-400">No hay contactos disponibles</p>
              ) : (
                contacts.map((c) => {
                  const online = onlineIds.includes(c.id);
                  const active = selected?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => openChat(c)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        active ? 'bg-sky-100/80' : 'hover:bg-white'
                      }`}
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-cyan-600 text-white text-sm font-bold flex items-center justify-center">
                          {getInitials(c.username)}
                        </div>
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                            online ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{c.username}</p>
                        <p className="text-xs text-slate-400">{c.rol}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <section className="flex-1 flex flex-col min-w-0">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <i className="fas fa-comment-dots text-4xl mb-3 opacity-40" />
                  <p className="text-sm font-medium">Selecciona un contacto para chatear</p>
                </div>
              </div>
            ) : (
              <>
                <header className="px-5 py-3 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-cyan-600 text-white text-sm font-bold flex items-center justify-center">
                    {getInitials(selected.username)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{selected.username}</p>
                    <p className="text-xs text-slate-400">
                      {onlineIds.includes(selected.id) ? 'En línea' : 'Desconectado'} · {selected.rol}
                    </p>
                  </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-white to-slate-50/80">
                  {messages.map((m) => {
                    const mine = m.emisor_id === user.id;
                    return (
                      <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                            mine
                              ? 'bg-sky-600 text-white rounded-br-md'
                              : 'bg-white border border-slate-100 text-slate-700 rounded-bl-md'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{m.contenido}</p>
                          <p className={`text-[10px] mt-1 ${mine ? 'text-sky-100' : 'text-slate-400'}`}>
                            {m.created_at ? formatDate(m.created_at) : ''}
                            {m.created_at ? ` · ${new Date(m.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}` : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                <form onSubmit={sendMessage} className="p-4 border-t border-slate-100 flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder="Escribe un mensaje..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={1000}
                  />
                  <button type="submit" className="btn-primary" disabled={!text.trim()}>
                    <i className="fas fa-paper-plane" /> Enviar
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
