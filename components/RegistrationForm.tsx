
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
            file ? 'border-green-400 bg-green-50' : 
            hasError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
          }`}
        >
          <input type="file" id={`file-${id}`} className="hidden" onChange={(e) => onChange(e.target.files?.[0] || null)} />
          <svg className={`w-5 h-5 mb-1 ${file ? 'text-green-500' : hasError ? 'text-red-400' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={file ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
          </svg>
          <span className={`text-[9px] text-center font-bold truncate max-w-full px-1 ${file ? 'text-green-700' : hasError ? 'text-red-500' : 'text-gray-400'}`}>
            {file ? file.name : 'Subir Foto'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-[32px] shadow-2xl border border-gray-100">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black text-[#0c3a4a]">Registo de Parceiro</h2>
        <p className="text-gray-500 text-xs mt-1 leading-relaxed">
          Preencha os dados. Após o envio, abriremos o seu WhatsApp para concluir o contacto com o administrador.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input required placeholder="Nome Completo" className="w-full px-4 py-3 rounded-xl border-none bg-gray-100 focus:ring-2 focus:ring-[#08677a] outline-none text-sm" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}/>
          <input required placeholder="Nome do Posto" className="w-full px-4 py-3 rounded-xl border-none bg-gray-100 focus:ring-2 focus:ring-[#08677a] outline-none text-sm" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input required type="tel" placeholder="Nº de Telefone" className="w-full px-4 py-3 rounded-xl border-none bg-gray-100 focus:ring-2 focus:ring-[#08677a] outline-none text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}/>
          <input required type="email" placeholder="E-mail do Proprietário" className="w-full px-4 py-3 rounded-xl border-none bg-gray-100 focus:ring-2 focus:ring-[#08677a] outline-none text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input required placeholder="NIF" className="w-full px-4 py-3 rounded-xl border-none bg-gray-100 focus:ring-2 focus:ring-[#08677a] outline-none text-sm uppercase" value={formData.nif} onChange={e => setFormData({...formData, nif: e.target.value})}/>
          <input required placeholder="BI" className="w-full px-4 py-3 rounded-xl border-none bg-gray-100 focus:ring-2 focus:ring-[#08677a] outline-none text-sm uppercase" value={formData.biNumber} onChange={e => setFormData({...formData, biNumber: e.target.value})}/>
        </div>

        <select className="w-full px-4 py-3 rounded-xl border-none bg-gray-100 outline-none text-sm" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})}>
          {SOYO_NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <div className="bg-gray-50 p-4 rounded-2xl">
          <h3 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest text-center">Documentos Obrigatórios</h3>
          <div className="grid grid-cols-3 gap-3">
            <FileInput label="BI" id="bi" file={files.bi} onChange={(f) => setFiles({...files, bi: f})} />
            <FileInput label="NIF" id="nif" file={files.nif} onChange={(f) => setFiles({...files, nif: f})} />
            <FileInput label="Alvará" id="legal" file={files.legal} onChange={(f) => setFiles({...files, legal: f})} />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl bg-[#08677a] text-white font-black hover:bg-[#0c3a4a] shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'ENVIAR PARA O MIGUEL'}
        </button>
        <button type="button" onClick={onCancel} className="w-full py-2 text-gray-400 font-bold text-xs uppercase tracking-widest">Cancelar</button>
      </form>
    </div>
  );
};
