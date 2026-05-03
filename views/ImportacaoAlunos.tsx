import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Icons } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { importStudents, getImportationLogs, detectImportConflicts } from '../services/adminService';
import { LogImportacao, ImportConflict } from '../types';

type ImportStep = 'UPLOAD' | 'MAPPING' | 'PREVIEW' | 'CONFLICT' | 'PROCESSING' | 'RESULT';

interface ColumnMapping {
    nomeCompleto: string;
    email: string;
    cpf: string;
    plano: string;
    dataVencimento: string;
}

const REQUIRED_FIELDS: (keyof ColumnMapping)[] = ['nomeCompleto', 'email', 'cpf'];

const ImportacaoAlunos: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState<ImportStep>('UPLOAD');
    const [file, setFile] = useState<File | null>(null);
    const [rawData, setRawData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [mapping, setMapping] = useState<ColumnMapping>({
        nomeCompleto: '',
        email: '',
        cpf: '',
        plano: '',
        dataVencimento: ''
    });
    const [logs, setLogs] = useState<LogImportacao[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(true);
    const [importResult, setImportResult] = useState<LogImportacao | null>(null);
    const [conflicts, setConflicts] = useState<ImportConflict[]>([]);
    const [authorizedMerges, setAuthorizedMerges] = useState<Record<number, boolean>>({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [allAuthorized, setAllAuthorized] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        setIsLoadingLogs(true);
        const data = await getImportationLogs();
        setLogs(data);
        setIsLoadingLogs(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) processFile(selectedFile);
    };

    const processFile = (file: File) => {
        setFile(file);
        const reader = new FileReader();

        if (file.name.endsWith('.csv')) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.data.length > 0) {
                        setHeaders(Object.keys(results.data[0] as object));
                        setRawData(results.data);
                        setStep('MAPPING');
                        autoMap(Object.keys(results.data[0] as object));
                    }
                }
            });
        } else {
            reader.onload = (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                if (json.length > 0) {
                    setHeaders(Object.keys(json[0] as object));
                    setRawData(json);
                    setStep('MAPPING');
                    autoMap(Object.keys(json[0] as object));
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const autoMap = (cols: string[]) => {
        const newMapping = { ...mapping };
        cols.forEach(col => {
            const lowCol = col.toLowerCase();
            if (lowCol.includes('nome')) newMapping.nomeCompleto = col;
            if (lowCol.includes('mail')) newMapping.email = col;
            if (lowCol.includes('cpf')) newMapping.cpf = col;
            if (lowCol.includes('plano')) newMapping.plano = col;
            if (lowCol.includes('venc') || lowCol.includes('vcto')) newMapping.dataVencimento = col;
        });
        setMapping(newMapping);
    };

    const handleImportPreview = async () => {
        if (!user) return;
        setIsProcessing(true);
        setStep('PROCESSING');

        const mappedData = rawData.map(row => ({
            nomeCompleto: row[mapping.nomeCompleto],
            email: row[mapping.email],
            cpf: row[mapping.cpf],
            plano: row[mapping.plano],
            dataVencimento: row[mapping.dataVencimento]
        }));

        // Primeiro, detectamos conflitos
        const foundConflicts = await detectImportConflicts(mappedData);
        
        if (foundConflicts.length > 0) {
            setConflicts(foundConflicts);
            // Por padrão, não autorizamos nada
            const initialMerges: Record<number, boolean> = {};
            foundConflicts.forEach(c => initialMerges[c.index] = false);
            setAuthorizedMerges(initialMerges);
            setAllAuthorized(false);
            setStep('CONFLICT');
            setIsProcessing(false);
        } else {
            // Se não houver conflitos, segue para o processamento final
            executeFinalImport(mappedData, {});
        }
    };

    const executeFinalImport = async (mappedData: any[], merges: Record<number, boolean>) => {
        setIsProcessing(true);
        setStep('PROCESSING');
        const result = await importStudents(user!.id, mappedData, file?.name || 'arquivo.xlsx', merges);
        setImportResult(result);
        setStep('RESULT');
        setIsProcessing(false);
        loadLogs();
    };

    const downloadTemplate = () => {
        const template = [
            { 'Nome Completo': 'João Silva', 'Email': 'joao@email.com', 'CPF': '123.456.789-01', 'Plano': 'GOLD', 'Vencimento': '2025-12-31' },
            { 'Nome Completo': 'Maria Oliveira', 'Email': 'maria@email.com', 'CPF': '987.654.321-00', 'Plano': 'BLACK', 'Vencimento': '2025-11-15' }
        ];
        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Modelo_Importacao");
        XLSX.writeFile(wb, "modelo_alunos_pg.xlsx");
    };

    const [copySuccess, setCopySuccess] = useState(false);

    const toggleAllMerges = () => {
        const newValue = !allAuthorized;
        setAllAuthorized(newValue);
        const newMerges: Record<number, boolean> = {};
        conflicts.forEach(c => newMerges[c.index] = newValue);
        setAuthorizedMerges(newMerges);
    };

    const handleCopyLog = () => {
        if (!importResult?.erros.length) return;
        const text = importResult.erros.map(err => `Linha ${err.linha}: ${err.motivo}`).join('\n');
        navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const renderStepUpload = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative h-64 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-pg-sharp flex flex-col items-center justify-center space-y-4 hover:border-pg-cobalt transition-all cursor-pointer bg-white dark:bg-white/5 backdrop-blur-xl"
            >
                <div className="w-16 h-16 rounded-pg-sharp bg-pg-cobalt/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icons.Upload className="w-8 h-8 text-pg-cobalt" />
                </div>
                <div className="text-center px-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Selecione ou arraste sua planilha</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tight mt-1">Formatos aceitos: .xlsx, .xls, .csv</p>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".xlsx,.xls,.csv" 
                    className="hidden" 
                />
            </div>

            <div className="flex justify-center">
                <button 
                    onClick={downloadTemplate}
                    className="flex items-center space-x-2 text-pg-cobalt hover:text-pg-cobalt/80 transition-colors"
                >
                    <Icons.FileSpreadsheet className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest border-b-2 border-pg-cobalt/20">Baixar Planilha Modelo</span>
                </button>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] px-2">Histórico Recente</h3>
                <div className="space-y-3">
                    {isLoadingLogs ? (
                        <div className="h-20 animate-pulse bg-white/5 rounded-pg-sharp" />
                    ) : logs.length > 0 ? (
                        logs.map(log => (
                            <div key={log.id} className="bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/5 p-4 rounded-pg-sharp flex items-center justify-between transition-all hover:border-pg-cobalt/30">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-pg-sharp bg-emerald-500/10 flex items-center justify-center">
                                        <Icons.CheckCircle className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px] uppercase tracking-tight">{log.arquivo}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">{new Date(log.realizadoEm).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-emerald-500">{log.importadosComSucesso + (log.mesclados || 0)}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">Processados</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center bg-white/5 rounded-pg-sharp border-2 border-dashed border-white/5">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nenhuma importação realizada</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderStepMapping = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="border-l-4 border-pg-cobalt pl-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Mapeamento de Colunas</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Associe as colunas da planilha aos campos do sistema</p>
            </div>

            <div className="bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/5 rounded-pg-sharp p-6 space-y-6">
                {Object.keys(mapping).map(field => (
                    <div key={field} className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {field === 'nomeCompleto' ? 'Nome Completo' :
                                 field === 'email' ? 'E-mail' :
                                 field === 'cpf' ? 'CPF' :
                                 field === 'plano' ? 'Plano' : 'Data de Vencimento'}
                                {REQUIRED_FIELDS.includes(field as any) && <span className="text-rose-500 ml-1 font-bold">*</span>}
                            </label>
                        </div>
                        <select 
                            value={mapping[field as keyof ColumnMapping]}
                            onChange={(e) => setMapping(prev => ({ ...prev, [field]: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 rounded-pg-sharp px-4 py-3 text-sm font-bold focus:border-pg-cobalt outline-none appearance-none cursor-pointer"
                        >
                            <option value="">Não importar</option>
                            {headers.map(h => (
                                <option key={h} value={h}>{h}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            <div className="flex space-x-4">
                <button 
                    onClick={() => setStep('UPLOAD')}
                    className="flex-1 py-4 bg-slate-100 dark:bg-white/5 rounded-pg-sharp text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-slate-200 transition-colors border-2 border-transparent"
                >
                    Voltar
                </button>
                <button 
                    disabled={!mapping.nomeCompleto || !mapping.email || !mapping.cpf}
                    onClick={() => setStep('PREVIEW')}
                    className="flex-1 py-4 bg-pg-cobalt rounded-pg-sharp text-[10px] font-bold text-white uppercase tracking-[0.2em] hover:bg-pg-cobalt/80 transition-colors disabled:opacity-50 shadow-lg shadow-pg-cobalt/20"
                >
                    Continuar
                </button>
            </div>
        </div>
    );

    const renderStepPreview = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
             <div className="border-l-4 border-pg-cobalt pl-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Prévia dos Dados</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verifique se as informações estão corretas ({rawData.length} linhas)</p>
            </div>

            <div className="overflow-hidden rounded-pg-sharp border-2 border-slate-200 dark:border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-white/5">
                                <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b-2 border-slate-200 dark:border-white/10">Nome</th>
                                <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b-2 border-slate-200 dark:border-white/10">Email</th>
                                <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b-2 border-slate-200 dark:border-white/10">CPF</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-transparent">
                            {rawData.slice(0, 5).map((row, i) => (
                                <tr key={i} className="border-b border-slate-100 dark:border-white/5">
                                    <td className="px-4 py-3 text-xs font-bold text-slate-900 dark:text-white/80 truncate max-w-[100px]">{row[mapping.nomeCompleto]}</td>
                                    <td className="px-4 py-3 text-xs font-bold text-slate-900 dark:text-white/80 truncate max-w-[100px]">{row[mapping.email]}</td>
                                    <td className="px-4 py-3 text-xs font-bold text-slate-900 dark:text-white/80">{row[mapping.cpf]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex space-x-4">
                <button 
                    onClick={() => setStep('MAPPING')}
                    className="flex-1 py-4 bg-slate-100 dark:bg-white/5 rounded-pg-sharp text-[10px] font-bold uppercase tracking-[0.2em] border-2 border-transparent"
                >
                    Ajustar Mapeamento
                </button>
                <button 
                    onClick={handleImportPreview}
                    className="flex-1 py-4 bg-pg-cobalt rounded-pg-sharp text-[10px] font-bold text-white uppercase tracking-[0.2em] shadow-lg shadow-pg-cobalt/20"
                >
                    Validar Conflitos
                </button>
            </div>
        </div>
    );

    const renderStepConflicts = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between border-l-4 border-rose-500 pl-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Conflitos Detectados</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alunos que já possuem cadastro no sistema ({conflicts.length})</p>
                </div>
                <button 
                    onClick={toggleAllMerges}
                    className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-pg-sharp text-[9px] font-black uppercase tracking-widest hover:bg-pg-cobalt/10 hover:text-pg-cobalt transition-colors"
                >
                    {allAuthorized ? 'DESMARCAR TODOS' : 'AUTORIZAR TODOS'}
                </button>
            </div>

            <div className="bg-rose-500/5 border-2 border-rose-500/10 p-4 rounded-pg-sharp">
                <p className="text-[10px] text-rose-500 font-bold uppercase leading-relaxed">
                    Atenção: A mesclagem atualizará os dados do aluno existente com as novas informações da planilha. 
                    Se não autorizar, a linha será ignorada.
                </p>
            </div>

            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 scrollbar-thin pb-4">
                {conflicts.map((conflict) => (
                    <div key={conflict.index} className="group bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/5 rounded-pg-sharp p-5 space-y-4 transition-all hover:bg-slate-50 dark:hover:bg-white/[0.07]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-pg-sharp bg-pg-cobalt/5 flex items-center justify-center border border-pg-cobalt/10">
                                    <Icons.User className="w-6 h-6 text-pg-cobalt" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{conflict.existingUser.name}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{conflict.existingUser.email}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setAuthorizedMerges(prev => ({ ...prev, [conflict.index]: !prev[conflict.index] }))}
                                className={`h-12 px-6 rounded-pg-sharp text-[10px] font-black uppercase tracking-widest transition-all ${
                                    authorizedMerges[conflict.index] 
                                        ? 'bg-pg-cobalt text-white shadow-lg shadow-pg-cobalt/30 ring-4 ring-pg-cobalt/10' 
                                        : 'bg-slate-100 dark:bg-white/10 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/20'
                                }`}
                            >
                                {authorizedMerges[conflict.index] ? 'AUTORIZADO' : 'IGNORAR'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 bg-slate-50 dark:bg-black/20 p-4 rounded-pg-sharp border border-slate-100 dark:border-white/5">
                            {conflict.differences.map((diff, i) => (
                                <div key={i} className="flex items-center justify-between group/diff">
                                    <div className="space-y-1">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">{diff.field}</span>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xs text-slate-500 line-through opacity-50">{diff.oldValue}</span>
                                            <Icons.ArrowRight className="w-3 h-3 text-pg-cobalt animate-pulse" />
                                            <span className="text-xs text-pg-cobalt font-black uppercase">{diff.newValue}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex space-x-4 pt-4">
                <button 
                    onClick={() => setStep('PREVIEW')}
                    className="flex-1 py-5 bg-slate-100 dark:bg-white/5 rounded-pg-sharp text-[10px] font-bold uppercase tracking-[0.2em] border-2 border-transparent hover:bg-slate-200 transition-all"
                >
                    Voltar
                </button>
                <button 
                    onClick={() => {
                        const mappedData = rawData.map(row => ({
                            nomeCompleto: row[mapping.nomeCompleto],
                            email: row[mapping.email],
                            cpf: row[mapping.cpf],
                            plano: row[mapping.plano],
                            dataVencimento: row[mapping.dataVencimento]
                        }));
                        executeFinalImport(mappedData, authorizedMerges);
                    }}
                    className="flex-1 py-5 bg-pg-cobalt rounded-pg-sharp text-[10px] font-bold text-white uppercase tracking-[0.2em] shadow-xl shadow-pg-cobalt/30 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    Finalizar ({rawData.length} linhas)
                </button>
            </div>
        </div>
    );

    const renderStepProcessing = () => (
        <div className="h-96 flex flex-col items-center justify-center space-y-8">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-pg-cobalt/20 rounded-pg-sharp rotate-45"></div>
                <div className="absolute top-0 left-0 w-24 h-24 border-4 border-pg-cobalt border-t-transparent rounded-pg-sharp rotate-45 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Icons.Users className="w-8 h-8 text-pg-cobalt animate-pulse" />
                </div>
            </div>
            <div className="text-center space-y-2">
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] animate-pulse">Sincronizando Dados</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Gravando registros na nuvem...</p>
            </div>
        </div>
    );

    const renderStepResult = () => (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-pg-sharp flex items-center justify-center mx-auto rotate-45">
                    <Icons.CheckCircle className="w-10 h-10 text-emerald-500 -rotate-45" />
                </div>
                <div className="pt-4">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Operação Concluída</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">O banco de dados foi atualizado com sucesso</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div className="bg-emerald-500/5 border-2 border-emerald-500/20 p-4 rounded-pg-sharp text-center">
                    <p className="text-2xl font-black text-emerald-500">{importResult?.importadosComSucesso}</p>
                    <p className="text-[8px] font-bold text-emerald-500/60 uppercase tracking-widest">Novos</p>
                </div>
                <div className="bg-pg-cobalt/5 border-2 border-pg-cobalt/20 p-4 rounded-pg-sharp text-center">
                    <p className="text-2xl font-black text-pg-cobalt">{importResult?.mesclados || 0}</p>
                    <p className="text-[8px] font-bold text-pg-cobalt/60 uppercase tracking-widest">Mesclados</p>
                </div>
                <div className="bg-rose-500/5 border-2 border-rose-500/20 p-4 rounded-pg-sharp text-center">
                    <p className="text-2xl font-black text-rose-500">{importResult?.erros.length}</p>
                    <p className="text-[8px] font-bold text-rose-500/60 uppercase tracking-widest">Falhas</p>
                </div>
            </div>

            {importResult?.erros && importResult.erros.length > 0 && (
                <div className="bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/5 rounded-pg-sharp p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center">
                            <Icons.AlertTriangle className="w-3 h-3 mr-2 text-rose-500" />
                            Log de Falhas
                        </h4>
                        <button 
                            onClick={handleCopyLog}
                            className="flex items-center space-x-1 text-[9px] font-black text-pg-cobalt uppercase tracking-widest hover:opacity-70 transition-all"
                        >
                            {copySuccess ? (
                                <>
                                    <Icons.Check className="w-3 h-3" />
                                    <span>Copiado!</span>
                                </>
                            ) : (
                                <>
                                    <Icons.Copy className="w-3 h-3" />
                                    <span>Copiar Log</span>
                                </>
                            )}
                        </button>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                        {importResult.erros.map((err, i) => (
                            <div key={i} className="flex justify-between items-center text-[10px] border-b border-white/5 pb-2 last:border-0">
                                <span className="text-slate-500 font-bold uppercase tracking-tighter">LINHA {err.linha}</span>
                                <span className="text-rose-500 font-black uppercase text-right ml-4">{err.motivo}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button 
                onClick={() => navigate('/management')}
                className="w-full py-5 bg-slate-900 dark:bg-pg-cobalt text-white rounded-pg-sharp text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] transition-transform"
            >
                Finalizar e Voltar
            </button>
        </div>
    );

    return (
        <div className="p-6 pb-12 space-y-8">
            {/* Header Mini */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => navigate('/management')}
                    className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:scale-105 transition-transform"
                >
                    <Icons.ChevronLeft className="w-5 h-5 text-slate-900 dark:text-white" />
                </button>
                <div className="text-right">
                    <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">Importar Alunos</h2>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Planilha CSV/XLSX</p>
                </div>
            </div>

            {/* Stepper Visual */}
            <div className="flex justify-between items-center px-4">
                {['UPLOAD', 'MAPPING', 'PREVIEW', 'CONFLICT', 'RESULT'].map((s, i) => (
                    <React.Fragment key={s}>
                        <div className={`w-8 h-8 rounded-pg-sharp flex items-center justify-center text-[10px] font-bold transition-all border-2 rotate-45 ${
                            step === s || (step === 'PROCESSING' && s === 'CONFLICT') 
                                ? 'bg-pg-cobalt border-pg-cobalt text-white shadow-lg shadow-pg-cobalt/40' 
                                : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'
                        }`}>
                            <span className="-rotate-45">{i + 1}</span>
                        </div>
                        {i < 4 && <div className={`flex-1 h-[2px] mx-2 ${step === s ? 'bg-pg-cobalt/20' : 'bg-slate-100 dark:bg-white/5'}`} />}
                    </React.Fragment>
                ))}
            </div>

            {/* Step Content */}
            <div className="relative overflow-hidden min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {step === 'UPLOAD' && renderStepUpload()}
                        {step === 'MAPPING' && renderStepMapping()}
                        {step === 'PREVIEW' && renderStepPreview()}
                        {step === 'CONFLICT' && renderStepConflicts()}
                        {step === 'PROCESSING' && renderStepProcessing()}
                        {step === 'RESULT' && renderStepResult()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ImportacaoAlunos;
