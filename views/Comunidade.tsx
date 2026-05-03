import React, { useState, useEffect } from 'react';
import { User, UserRole, PostMural, PostTipo } from '../types';
import { getMuralPosts, createPost, toggleLikePost, addCommentToPost, deletePost, togglePinPost, deleteCommentFromPost } from '../firebase';
import { Icons } from '../constants';
import { ComentarioPost } from '../types';

const Comunidade: React.FC<{ user: User; isDarkMode: boolean }> = ({ user, isDarkMode }) => {
  const [posts, setPosts] = useState<PostMural[]>([]);
  const [novoPost, setNovoPost] = useState('');
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState<'Tudo' | 'Avisos' | 'Comentarios'>('Tudo');

  useEffect(() => {
    carregarPosts();
  }, []);

  const carregarPosts = async () => {
    try {
      const data = await getMuralPosts();
      setPosts(data);
    } catch (error) {
      console.error("Erro ao carregar mural:", error);
    } finally {
      setCarregando(false);
    }
  };

  const publicarPost = async () => {
    if (!novoPost.trim() && !imagemPreview) return;
    setEnviando(true);
    try {
      await createPost({
        autorId: user.id,
        autorNome: user.name,
        autorRole: user.role,
        autorFoto: user.avatar,
        tipo: user.role === UserRole.ALUNO ? 'GERAL' : 'AVISO_ACADEMIA',
        conteudo: novoPost,
        imagemUrl: imagemPreview || undefined, // Placeholder for actual upload
        curtidas: [],
        comentarios: [],
        fixado: false,
        visivel: true
      });
      setNovoPost('');
      setImagemPreview(null);
      await carregarPosts();
    } catch (error) {
      console.error("Erro ao publicar post:", error);
    } finally {
      setEnviando(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatarDataRelativa = (data: Date) => {
    const agora = new Date();
    const diff = Math.floor((agora.getTime() - data.getTime()) / 1000);
    if (diff < 60) return 'agora';
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="pg-screen px-4 pt-4 overflow-y-auto h-full scrollbar-hide">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-black text-white">Mural da turma</h1>
        <p className="text-pg-text-muted text-sm">
          Compartilhe, comemore e interaja com a galera da PersonalGroup.
        </p>
      </div>

      {/* Campo de novo post */}
      <div className="rounded-pg-card bg-pg-surface-dark border border-white/5 p-3 mb-4 transition-all focus-within:border-pg-cobalt/30 shadow-2xl">
        <textarea
          value={novoPost}
          onChange={e => setNovoPost(e.target.value)}
          placeholder="Compartilhe algo com a turma..."
          className="w-full h-20 bg-transparent text-white text-sm resize-none 
                     focus:outline-none placeholder:text-pg-text-muted"
          maxLength={280}
        />
        
        {imagemPreview && (
          <div className="relative mt-2 mb-3 rounded-lg overflow-hidden border border-white/10 group">
            <img src={imagemPreview} alt="Preview" className="w-full max-h-48 object-cover" />
            <button 
              onClick={() => setImagemPreview(null)}
              className="absolute top-2 right-2 p-1 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
          <div className="flex items-center gap-3">
            <label className="cursor-pointer p-2 rounded-full hover:bg-white/5 transition-colors text-pg-cobalt">
              <Icons.Camera className="w-5 h-5" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            </label>
            <span className="text-pg-text-muted text-[10px] font-medium tracking-wider uppercase">{novoPost.length}/280</span>
          </div>
          <button
            onClick={publicarPost}
            disabled={enviando || (!novoPost.trim() && !imagemPreview)}
            className="px-5 py-2 rounded-pg-pill bg-pg-cobalt text-midnight text-xs font-black uppercase tracking-tighter disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_12px_rgba(0,182,253,0.3)]"
          >
            {enviando ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>
      
      {/* Tabs de Filtro */}
      <div className="flex gap-2 mb-4 p-1 bg-white/5 rounded-pg-pill backdrop-blur-sm border border-white/5">
        <button
          onClick={() => setAbaAtiva('Tudo')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-pg-pill text-xs font-black uppercase tracking-tighter transition-all duration-300 ${
            abaAtiva === 'Tudo' 
              ? 'bg-gradient-to-r from-pg-cobalt to-pg-cobalt/80 text-midnight shadow-[0_4px_15px_rgba(0,182,253,0.4)] scale-[1.02]' 
              : 'text-pg-text-muted hover:text-white hover:bg-white/5'
          }`}
        >
          <Icons.Layout className="w-3.5 h-3.5" />
          Geral
        </button>
        <button
          onClick={() => setAbaAtiva('Avisos')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-pg-pill text-xs font-black uppercase tracking-tighter transition-all duration-300 ${
            abaAtiva === 'Avisos' 
              ? 'bg-gradient-to-r from-pg-cobalt to-pg-cobalt/80 text-midnight shadow-[0_4px_15px_rgba(0,182,253,0.4)] scale-[1.02]' 
              : 'text-pg-text-muted hover:text-white hover:bg-white/5'
          }`}
        >
          <Icons.Bell className="w-3.5 h-3.5" />
          Avisos
        </button>
        <button
          onClick={() => setAbaAtiva('Comentarios')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-pg-pill text-xs font-black uppercase tracking-tighter transition-all duration-300 ${
            abaAtiva === 'Comentarios' 
              ? 'bg-gradient-to-r from-pg-cobalt to-pg-cobalt/80 text-midnight shadow-[0_4px_15px_rgba(0,182,253,0.4)] scale-[1.02]' 
              : 'text-pg-text-muted hover:text-white hover:bg-white/5'
          }`}
        >
          <Icons.MessageSquare className="w-3.5 h-3.5" />
          Comentários
        </button>
      </div>

      {/* Lista de posts */}
      <div className="space-y-3 pb-24">
        {carregando ? (
           <div className="py-12 flex justify-center">
             <div className="w-8 h-8 border-2 border-pg-cobalt border-t-transparent rounded-full animate-spin" />
           </div>
        ) : abaAtiva === 'Comentarios' ? (
          <div className="space-y-4">
             {posts.flatMap(p => p.comentarios.map(c => ({ ...c, postId: p.id, postConteudo: p.conteudo })))
              .sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime())
              .slice(0, 15)
              .map(com => (
                <div key={com.id} className="rounded-pg-card bg-pg-surface-dark border border-white/5 p-4 animate-reveal">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-6 h-6 rounded-full bg-pg-cobalt/20 flex items-center justify-center text-[10px] font-black text-pg-cobalt">
                       {com.autorFoto ? <img src={com.autorFoto} className="w-full h-full object-cover rounded-full" /> : com.autorNome.charAt(0)}
                     </div>
                     <span className="text-xs font-bold text-white">{com.autorNome}</span>
                     <span className="text-[10px] text-pg-text-muted ml-auto">{formatarDataRelativa(com.criadoEm)}</span>
                  </div>
                  <p className="text-white/80 text-sm italic mb-2">"{com.conteudo}"</p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                     <p className="text-[10px] text-pg-text-muted truncate flex-1">Em: {com.postConteudo}</p>
                     <button 
                        onClick={() => {
                          setAbaAtiva('Tudo');
                          // Scroll logic could go here
                        }}
                        className="text-[10px] font-black text-pg-cobalt uppercase ml-2"
                      >
                        Ver Post
                      </button>
                  </div>
                </div>
              ))}
              {posts.every(p => p.comentarios.length === 0) && (
                <div className="py-20 text-center">
                  <p className="text-pg-text-muted text-sm italic">Nenhum comentário recente.</p>
                </div>
              )}
          </div>
        ) : (
          posts
            .filter(post => {
              if (abaAtiva === 'Avisos') return post.tipo === 'AVISO_ACADEMIA' || post.fixado;
              return true;
            })
            .sort((a, b) => {
              // Prioriza fixados no "Tudo", mas no "Avisos" eles já estão filtrados
              if (a.fixado && !b.fixado) return -1;
              if (!a.fixado && b.fixado) return 1;
              return 0;
            })
            .length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center px-8">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                  <Icons.MessageSquare className="w-8 h-8 text-pg-text-muted opacity-30" />
                </div>
                <p className="text-pg-text-muted text-sm font-medium">
                  {abaAtiva === 'Avisos' 
                    ? 'Nenhum aviso importante no momento.' 
                    : 'Nenhuma publicação encontrada.'}
                </p>
              </div>
            ) : (
              posts
                .filter(post => {
                  if (abaAtiva === 'Avisos') return post.tipo === 'AVISO_ACADEMIA' || post.fixado;
                  return true;
                })
                .sort((a, b) => {
                  if (a.fixado && !b.fixado) return -1;
                  if (!a.fixado && b.fixado) return 1;
                  return 0;
                })
                .map(post => (
                  <CartaoPost 
                    key={post.id} 
                    post={post} 
                    usuarioAtual={user} 
                    formatarDataRelativa={formatarDataRelativa}
                    onUpdate={carregarPosts}
                  />
                ))
            )
        )}
      </div>
    </div>
  );
};

const CartaoPost: React.FC<{ 
  post: PostMural; 
  usuarioAtual: User; 
  formatarDataRelativa: (d: Date) => string;
  onUpdate: () => void;
}> = ({ post, usuarioAtual, formatarDataRelativa, onUpdate }) => {
  const [curtidas, setCurtidas] = useState(post.curtidas || []);
  const [comentarios, setComentarios] = useState(post.comentarios || []);
  const [exibirComentarios, setExibirComentarios] = useState(false);
  const [novoComentario, setNovoComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [animandoLike, setAnimandoLike] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const jaCurtiu = curtidas.includes(usuarioAtual.id);

  const handleLike = async () => {
    if (animandoLike) return;
    
    // Feedback visual imediato (Optimistic UI)
    const novaLista = jaCurtiu 
      ? curtidas.filter(id => id !== usuarioAtual.id)
      : [...curtidas, usuarioAtual.id];
    
    setCurtidas(novaLista);
    if (!jaCurtiu) {
      setAnimandoLike(true);
      if (window.navigator.vibrate) window.navigator.vibrate(10); // Haptic feedback
      setTimeout(() => setAnimandoLike(false), 600);
    }

    try {
      await toggleLikePost(post.id, usuarioAtual.id, jaCurtiu);
    } catch (error) {
      setCurtidas(curtidas); // Reverte em caso de erro
      console.error("Erro ao curtir:", error);
    }
  };

  const enviarComentario = async () => {
    if (!novoComentario.trim() || enviandoComentario) return;
    setEnviandoComentario(true);

    try {
      const resp = await addCommentToPost(post.id, {
        autorId: usuarioAtual.id,
        autorNome: usuarioAtual.name,
        conteudo: novoComentario
      });
      setComentarios([...comentarios, resp]);
      setNovoComentario('');
    } catch (error) {
      console.error("Erro ao comentar:", error);
    } finally {
      setEnviandoComentario(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Deseja realmente excluir esta publicação?')) return;
    try {
      await deletePost(post.id);
      onUpdate();
    } catch (error) {
      console.error("Erro ao excluir post:", error);
    }
  };

  const handleTogglePin = async () => {
    try {
      await togglePinPost(post.id, post.fixado);
      onUpdate();
    } catch (error) {
      console.error("Erro ao fixar post:", error);
    } finally {
      setMenuAberto(false);
    }
  };

  const handleDeleteComment = async (com: ComentarioPost) => {
    try {
      await deleteCommentFromPost(post.id, com);
      setComentarios(comentarios.filter(c => c.id !== com.id));
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);
    }
  };

  return (
    <div className={`rounded-pg-card bg-pg-surface-dark border border-white/5 p-4 animate-reveal shadow-lg ${post.fixado ? 'border-pg-cobalt/20 ring-1 ring-pg-cobalt/10' : ''}`}>
      {/* Autor */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-pg-cobalt/20 border border-pg-cobalt/10 flex items-center justify-center text-pg-cobalt font-black text-sm shadow-inner overflow-hidden">
          {post.autorFoto ? (
            <img src={post.autorFoto} alt={post.autorNome} className="w-full h-full object-cover" />
          ) : (
            post.autorNome.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-white text-sm font-bold truncate">{post.autorNome}</p>
            {post.fixado && <span className="text-[10px] text-pg-cobalt font-black uppercase">Fixado</span>}
          </div>
          <p className="text-pg-text-muted text-[10px] font-medium tracking-wider uppercase">
            {formatarDataRelativa(post.criadoEm)}
          </p>
        </div>
        {(post.tipo === 'AVISO_ACADEMIA' || post.autorRole === UserRole.ADMIN || post.autorRole === UserRole.CHEFE) && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-pg-cobalt/10 text-pg-cobalt font-black uppercase border border-pg-cobalt/20 shadow-[0_0_8px_rgba(0,182,253,0.1)]">
            Aviso
          </span>
        )}
      </div>

      {/* Conteúdo */}
      <p className="text-white/90 text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.conteudo}</p>
      
      {post.imagemUrl && (
        <div className="mb-4 rounded-xl overflow-hidden border border-white/5 shadow-2xl">
          <img src={post.imagemUrl} alt="Post" className="w-full object-cover max-h-72" />
        </div>
      )}

      {/* Ações */}
      <div className="flex items-center gap-6 pt-3 border-t border-white/5">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 text-xs font-bold transition-all relative ${jaCurtiu ? 'text-pg-cobalt scale-110' : 'text-pg-text-muted hover:text-white'}`}
        >
          <Icons.Heart className={`w-4 h-4 transition-all ${jaCurtiu ? 'fill-pg-cobalt stroke-pg-cobalt' : ''} ${animandoLike ? 'animate-ping' : ''}`} />
          {curtidas.length > 0 && <span className="tabular-nums">{curtidas.length}</span>}
          
          {animandoLike && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 bg-pg-cobalt/20 rounded-full animate-ping" />
             </div>
          )}
        </button>

        <button 
          onClick={() => setExibirComentarios(!exibirComentarios)}
          className={`flex items-center gap-2 text-xs font-bold transition-all ${exibirComentarios ? 'text-white' : 'text-pg-text-muted hover:text-white'}`}
        >
          <Icons.MessageCircle className={`w-4 h-4 ${exibirComentarios ? 'fill-white/10' : ''}`} />
          {comentarios.length > 0 && <span className="tabular-nums">{comentarios.length}</span>}
        </button>
        
        {(usuarioAtual.role === UserRole.ADMIN || usuarioAtual.role === UserRole.CHEFE || post.autorId === usuarioAtual.id) && (
          <div className="ml-auto relative">
            <button 
              onClick={() => setMenuAberto(!menuAberto)}
              className="text-pg-text-muted hover:text-white transition-colors p-1"
            >
              <Icons.MoreVertical className="w-4 h-4" />
            </button>
            
            {menuAberto && (
              <div className="absolute right-0 bottom-full mb-2 w-40 bg-pg-surface-dark border border-white/10 rounded-lg shadow-2xl overflow-hidden z-20 animate-reveal">
                {(usuarioAtual.role === UserRole.ADMIN || usuarioAtual.role === UserRole.CHEFE) && (
                  <button 
                    onClick={handleTogglePin}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-white hover:bg-white/5 transition-colors border-b border-white/5"
                  >
                    <Icons.Zap className={`w-3 h-3 ${post.fixado ? 'text-pg-cobalt' : 'text-pg-text-muted'}`} />
                    {post.fixado ? 'Desafixar' : 'Fixar no topo'}
                  </button>
                )}
                <button 
                  onClick={handleDeletePost}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Icons.AlertTriangle className="w-3 h-3" />
                  Excluir post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Seção de Comentários */}
      {exibirComentarios && (
        <div className="mt-4 pt-4 border-t border-white/5 animate-slide-up">
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto scrollbar-hide">
            {comentarios.length === 0 ? (
              <div className="py-6 flex flex-col items-center justify-center opacity-40">
                <Icons.MessageCircle className="w-8 h-8 mb-2" />
                <p className="text-[10px] uppercase font-black tracking-widest text-center">Nenhum comentário</p>
                <p className="text-[9px] font-medium text-center">Inicie a conversa abaixo!</p>
              </div>
            ) : (
              comentarios.map(com => (
                <div key={com.id} className="flex gap-2 group/comment">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-pg-text-muted shrink-0">
                    {com.autorNome.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 bg-white/5 rounded-2xl rounded-tl-none p-2 px-3 relative">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[11px] font-bold text-white/70">{com.autorNome}</span>
                      <span className="text-[9px] text-pg-text-muted">{formatarDataRelativa(com.criadoEm)}</span>
                    </div>
                    <p className="text-white/90 text-[12px] leading-tight">{com.conteudo}</p>
                    
                    {/* Excluir comentário */}
                    {(usuarioAtual.id === com.autorId || usuarioAtual.role === UserRole.ADMIN || usuarioAtual.role === UserRole.CHEFE) && (
                      <button 
                        onClick={() => handleDeleteComment(com)}
                        className="absolute -right-2 -top-2 p-1 bg-pg-surface-dark border border-white/10 rounded-full text-pg-text-muted hover:text-red-400 opacity-0 group-hover/comment:opacity-100 transition-all shadow-lg"
                      >
                        <Icons.X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2 items-center bg-white/5 rounded-pg-pill p-1 px-3 focus-within:bg-white/10 transition-all border border-transparent focus-within:border-pg-cobalt/20">
            <input 
              value={novoComentario}
              onChange={e => setNovoComentario(e.target.value)}
              placeholder="Escreva um comentário..."
              className="flex-1 bg-transparent text-xs text-white outline-none py-2 placeholder:text-pg-text-muted"
              onKeyPress={e => e.key === 'Enter' && enviarComentario()}
            />
            <button 
              onClick={enviarComentario}
              disabled={!novoComentario.trim() || enviandoComentario}
              className="text-pg-cobalt disabled:opacity-30 p-1 hover:scale-110 active:scale-90 transition-all"
            >
              <Icons.Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comunidade;
