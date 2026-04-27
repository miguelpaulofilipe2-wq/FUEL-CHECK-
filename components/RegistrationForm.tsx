
import React, { useState } from 'react';
import { BusinessOwner } from '../types';
import { SOYO_NEIGHBORHOODS, ADMIN_EMAIL, ADMIN_WHATSAPP } from '../constants';

interface Props {
  onRegister: (data: BusinessOwner) => void;
  onCancel: () => void;
}

export const RegistrationForm: React.FC<Props> = ({ onRegister, onCancel }) => {
  const [formData, setFormData] = useState<BusinessOwner>({
    fullName: '',
    phone: '',
    email: '',
    nif: '',
    biNumber: '',
    neighborhood: SOYO_NEIGHBORHOODS[0],
    companyName: ''
  });

  const [files, setFiles] = useState({
    bi: null as File | null,
    nif: null as File | null,
    legal: null as File | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!files.bi || !files.nif || !files.legal) {
      setShowErrors(true);
      alert("Por favor, carregue as fotos dos 3 documentos obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Enviar para E-mail (FormSubmit)
      const formPayload = new FormData();
      formPayload.append('_subject', `NOVO REGISTO: ${formData.companyName}`);
      formPayload.append('Nome', formData.fullName);
      formPayload.append('Posto', formData.companyName);
      formPayload.append('Telefone', formData.phone);
      formPayload.append('Email', formData.email);
      formPayload.append('NIF', formData.nif);
      formPayload.append('BI', formData.biNumber);
      formPayload.append('Bairro', formData.neighborhood);
      formPayload.append('Anexo_BI', files.bi);
      formPayload.append('Anexo_NIF', files.nif);
      formPayload.append('Anexo_Alvara', files.legal);

      await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
        method: 'POST',
        body: formPayload
      });

      // 2. Preparar mensagem WhatsApp
      // Nota: Usamos a URL base sem parâmetros para o link de acesso manual
      const baseUrl = window.location.href.split('?')[0].split('#')[0];
      const loginUrl = `${baseUrl}?login=${encodeURIComponent(formData.email)}`;

      const waMessage = `*NOVO CADASTRO - FUEL CHECK SOYO*%0A%0A` +
        `*Dono:* ${formData.fullName}%0A` +
        `*Empresa:* ${formData.companyName}%0A` +
        `*Email:* ${formData.email}%0A` +
        `*Telefone:* ${formData.phone}%0A%0A` +
        `*DOCUMENTOS ENVIADOS NO E-MAIL.*%0A%0A` +
        `*LINK DE ACESSO DIRETO:*%0A${loginUrl}%0A%0A` +
        `_Se o link não funcionar, o usuário pode entrar manualmente com o e-mail no aplicativo._`;

      const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${waMessage}`;
      window.open(waUrl, '_blank');

      onRegister(formData);

    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao enviar. Verifique a internet e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileInput = ({ label, id, file, onChange }: { label: string, id: string, file: File | null, onChange: (f: File | null) => void }) => {
    const hasError = showErrors && !file;
    return (
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{label}</label>
        <div 
          onClick={() => document.getElementById(`file-${id}`)?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-3 transition-all flex flex-col items-center justify-center min-h-[85px] cursor-pointer ${
            file ? 'border-green-400 bg-green-950/20' : 
            hasError ? 'border-red-400 bg-red-950/20' : 'border-white/5 bg-white/5'
          }`}
        >
          <input type="file" id={`file-${id}`} className="hidden" onChange={(e) => onChange(e.target.files?.[0] || null)} />
          <svg className={`w-5 h-5 mb-1 ${file ? 'text-green-500' : hasError ? 'text-red-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={file ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
          </svg>
          <span className={`text-[9px] text-center font-bold truncate max-w-full px-1 ${file ? 'text-green-400' : hasError ? 'text-red-400' : 'text-gray-500'}`}>
            {file ? file.name : 'Subir Foto'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#121212] p-6 sm:p-8 rounded-[32px] shadow-2xl border border-white/5">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black text-white">Registo de Parceiro</h2>
        <p className="text-gray-500 text-xs mt-1 leading-relaxed">
          Preencha os dados. Após o envio, abriremos o seu WhatsApp para concluir o contacto com o administrador.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input required placeholder="Nome Completo" className="w-full px-4 py-3 rounded-xl border-none bg-white/5 text-white focus:ring-2 focus:ring-[#08677a] outline-none text-sm placeholder:text-gray-600" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}/>
          <input required placeholder="Nome do Posto" className="w-full px-4 py-3 rounded-xl border-none bg-white/5 text-white focus:ring-2 focus:ring-[#08677a] outline-none text-sm placeholder:text-gray-600" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input required type="tel" placeholder="Nº de Telefone" className="w-full px-4 py-3 rounded-xl border-none bg-white/5 text-white focus:ring-2 focus:ring-[#08677a] outline-none text-sm placeholder:text-gray-600" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}/>
          <input required type="email" placeholder="E-mail do Proprietário" className="w-full px-4 py-3 rounded-xl border-none bg-white/5 text-white focus:ring-2 focus:ring-[#08677a] outline-none text-sm placeholder:text-gray-600" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input required placeholder="NIF" className="w-full px-4 py-3 rounded-xl border-none bg-white/5 text-white focus:ring-2 focus:ring-[#08677a] outline-none text-sm uppercase placeholder:text-gray-600" value={formData.nif} onChange={e => setFormData({...formData, nif: e.target.value})}/>
          <input required placeholder="BI" className="w-full px-4 py-3 rounded-xl border-none bg-white/5 text-white focus:ring-2 focus:ring-[#08677a] outline-none text-sm uppercase placeholder:text-gray-600" value={formData.biNumber} onChange={e => setFormData({...formData, biNumber: e.target.value})}/>
        </div>

        <div className="relative">
          <select className="w-full px-4 py-3 rounded-xl border-none bg-white/5 text-white outline-none text-sm appearance-none" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})}>
            {SOYO_NEIGHBORHOODS.map(n => <option key={n} value={n} className="bg-[#121212]">{n}</option>)}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>

        <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
          <h3 className="text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest text-center">Documentos Obrigatórios</h3>
          <div className="grid grid-cols-3 gap-3">
            <FileInput label="BI" id="bi" file={files.bi} onChange={(f) => setFiles({...files, bi: f})} />
            <FileInput label="NIF" id="nif" file={files.nif} onChange={(f) => setFiles({...files, nif: f})} />
            <FileInput label="Alvará" id="legal" file={files.legal} onChange={(f) => setFiles({...files, legal: f})} />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl bg-[#08677a] text-white font-black hover:bg-[#0c3a4a] shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
        >
          {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'ENVIAR PARA O MIGUEL'}
        </button>
        <button type="button" onClick={onCancel} className="w-full py-2 text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-gray-300 transition-colors">Cancelar</button>
      </form>
    </div>
  );
};
