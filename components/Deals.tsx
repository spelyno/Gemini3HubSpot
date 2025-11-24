import React, { useState } from 'react';
import { Deal, DealStage, Contact } from '../types';
import { MoreHorizontal, Plus, AlertCircle, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { GeminiService } from '../services/geminiService';

interface DealsProps {
  deals: Deal[];
  contacts: Contact[];
  onUpdateDeal: (updatedDeal: Deal) => void;
  onAddDeal: () => void;
}

const Deals: React.FC<DealsProps> = ({ deals, contacts, onUpdateDeal, onAddDeal }) => {
  const [analyzingDealId, setAnalyzingDealId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{[key: string]: { analysis: string; recommendedAction: string }}>({});

  const getContact = (id: string) => contacts.find(c => c.id === id);

  const handleAnalyzeDeal = async (deal: Deal) => {
    const contact = getContact(deal.contactId);
    if (!contact) return;

    setAnalyzingDealId(deal.id);
    const result = await GeminiService.analyzeDeal(deal, contact);
    setAnalysisResult(prev => ({ ...prev, [deal.id]: result }));
    setAnalyzingDealId(null);
  };

  const stages = Object.values(DealStage);

  return (
    <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Pipeline</h2>
            <button 
              onClick={onAddDeal}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
            >
                <Plus size={16} /> New Deal
            </button>
        </div>

        {/* Kanban Board Container */}
        <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-[1200px] h-full">
                {stages.map(stage => (
                    <div key={stage} className="flex-1 flex flex-col min-w-[280px]">
                        <div className="mb-3 flex justify-between items-center sticky top-0 bg-slate-50 z-10 py-2">
                            <span className="font-semibold text-slate-700 text-sm uppercase tracking-wider">{stage}</span>
                            <span className="text-xs font-medium text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                                {deals.filter(d => d.stage === stage).length}
                            </span>
                        </div>
                        
                        <div className="flex-1 bg-slate-100/50 rounded-xl p-2 space-y-3 border border-slate-200/50">
                            {deals.filter(d => d.stage === stage).map(deal => {
                                const contact = getContact(deal.contactId);
                                const analysis = analysisResult[deal.id];

                                return (
                                    <div key={deal.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-medium text-slate-900 line-clamp-2">{deal.title}</h4>
                                            <button className="text-slate-400 hover:text-slate-600">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="text-sm text-slate-500 mb-3">
                                            <p className="font-semibold text-slate-700">${deal.amount.toLocaleString()}</p>
                                            {contact && <p className="text-xs mt-1">{contact.company}</p>}
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className={`h-2 rounded-full flex-1 w-16 bg-slate-100 overflow-hidden`}
                                                    title={`Probability: ${deal.probability}%`}
                                                >
                                                    <div 
                                                        className={`h-full ${deal.probability > 70 ? 'bg-emerald-500' : deal.probability > 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                                        style={{ width: `${deal.probability}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            
                                            {/* AI Button */}
                                            <button 
                                                onClick={() => handleAnalyzeDeal(deal)}
                                                disabled={analyzingDealId === deal.id}
                                                className={`p-1.5 rounded-md transition-colors ${analysis ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'}`}
                                                title="AI Insight"
                                            >
                                                {analyzingDealId === deal.id ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                                            </button>
                                        </div>

                                        {/* AI Analysis Result */}
                                        {analysis && (
                                            <div className="mt-3 bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-xs animate-fade-in">
                                                <div className="flex items-start gap-2 mb-2">
                                                    <AlertCircle size={12} className="text-indigo-600 mt-0.5 shrink-0" />
                                                    <p className="text-indigo-900 leading-snug">{analysis.analysis}</p>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <ArrowRight size={12} className="text-emerald-600 mt-0.5 shrink-0" />
                                                    <p className="text-emerald-800 font-medium leading-snug">{analysis.recommendedAction}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Deals;
