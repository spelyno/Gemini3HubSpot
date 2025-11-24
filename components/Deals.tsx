import React, { useState } from 'react';
import { Deal, DealStage, Contact } from '../types';
import { MoreHorizontal, Plus, AlertCircle, ArrowRight, Sparkles, Loader2, X, GripVertical } from 'lucide-react';
import { GeminiService } from '../services/geminiService';

interface DealsProps {
  deals: Deal[];
  contacts: Contact[];
  onUpdateDeal: (updatedDeal: Deal) => void;
  onAddDeal: () => void;
  filterStage?: DealStage | null;
  onClearFilter?: () => void;
}

const Deals: React.FC<DealsProps> = ({ deals, contacts, onUpdateDeal, onAddDeal, filterStage, onClearFilter }) => {
  const [analyzingDealId, setAnalyzingDealId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{[key: string]: { analysis: string; recommendedAction: string }}>({});
  
  // Drag and Drop State
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);

  const getContact = (id: string) => contacts.find(c => c.id === id);

  const handleAnalyzeDeal = async (deal: Deal) => {
    const contact = getContact(deal.contactId);
    if (!contact) return;

    setAnalyzingDealId(deal.id);
    const result = await GeminiService.analyzeDeal(deal, contact);
    setAnalysisResult(prev => ({ ...prev, [deal.id]: result }));
    setAnalyzingDealId(null);
  };

  // Drag Event Handlers
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    setDraggedDealId(dealId);
    e.dataTransfer.effectAllowed = "move";
    // Set a transparent image or handle drag preview if needed, default ghost is usually fine
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    if (draggedDealId) {
      setDragOverStage(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // We intentionally don't clear immediately to prevent flickering when moving over child elements
    // Logic is handled by the new DragEnter on a sibling or drop
  };

  const handleDrop = (e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault();
    setDragOverStage(null);
    
    if (!draggedDealId) return;

    const dealToMove = deals.find(d => d.id === draggedDealId);
    if (dealToMove && dealToMove.stage !== targetStage) {
      onUpdateDeal({ ...dealToMove, stage: targetStage });
    }
    
    setDraggedDealId(null);
  };

  const stages = filterStage ? [filterStage] : Object.values(DealStage);

  return (
    <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Pipeline 
              {filterStage && (
                <span className="text-sm font-normal text-slate-400 bg-slate-800 px-2 py-1 rounded-md flex items-center gap-1 border border-slate-700">
                  Filtered by: {filterStage}
                  <button onClick={onClearFilter} className="hover:text-red-400 ml-1"><X size={14}/></button>
                </span>
              )}
            </h2>
            <button 
              onClick={onAddDeal}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500 flex items-center gap-2 shadow-lg shadow-indigo-900/30"
            >
                <Plus size={16} /> New Deal
            </button>
        </div>

        {/* Kanban Board Container */}
        <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
            <div className={`flex gap-4 h-full ${filterStage ? 'min-w-[350px] max-w-[400px]' : 'min-w-[1200px]'}`}>
                {stages.map(stage => (
                    <div 
                        key={stage} 
                        className={`flex-1 flex flex-col min-w-[280px] rounded-xl transition-colors duration-200 ${
                            dragOverStage === stage && !filterStage 
                                ? 'bg-indigo-900/10 ring-2 ring-indigo-500/30' 
                                : ''
                        }`}
                        onDragOver={handleDragOver}
                        onDragEnter={(e) => handleDragEnter(e, stage as DealStage)}
                        onDrop={(e) => handleDrop(e, stage as DealStage)}
                    >
                        <div className="mb-3 flex justify-between items-center sticky top-0 bg-slate-950 z-10 py-2">
                            <span className={`font-semibold text-sm uppercase tracking-wider ${dragOverStage === stage ? 'text-indigo-400' : 'text-slate-400'}`}>{stage}</span>
                            <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                                {deals.filter(d => d.stage === stage).length}
                            </span>
                        </div>
                        
                        <div className={`flex-1 rounded-xl p-2 space-y-3 border transition-colors ${
                            dragOverStage === stage 
                                ? 'bg-indigo-900/20 border-indigo-500/30 border-dashed' 
                                : 'bg-slate-900/50 border-slate-800'
                        }`}>
                            {deals.filter(d => d.stage === stage).map(deal => {
                                const contact = getContact(deal.contactId);
                                const analysis = analysisResult[deal.id];
                                const isDragging = draggedDealId === deal.id;

                                return (
                                    <div 
                                        key={deal.id} 
                                        draggable={!filterStage} // Disable drag if filtered
                                        onDragStart={(e) => handleDragStart(e, deal.id)}
                                        className={`bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-700 hover:border-indigo-500/50 hover:shadow-md transition-all group relative cursor-grab active:cursor-grabbing ${
                                            isDragging ? 'opacity-50 scale-95 border-indigo-500 rotate-1' : ''
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex gap-2 items-start">
                                                {!filterStage && (
                                                   <GripVertical size={16} className="text-slate-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                )}
                                                <h4 className="font-medium text-slate-200 line-clamp-2 select-none">{deal.title}</h4>
                                            </div>
                                            <button className="text-slate-500 hover:text-slate-300">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="text-sm text-slate-500 mb-3 pl-6">
                                            <p className="font-semibold text-slate-300 pointer-events-none">${deal.amount.toLocaleString()}</p>
                                            {contact && <p className="text-xs mt-1 text-slate-400 pointer-events-none">{contact.company}</p>}
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700 pl-6">
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className={`h-2 rounded-full flex-1 w-16 bg-slate-900 overflow-hidden`}
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
                                                className={`p-1.5 rounded-md transition-colors ${analysis ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500 hover:bg-indigo-500/10 hover:text-indigo-400'}`}
                                                title="AI Insight"
                                            >
                                                {analyzingDealId === deal.id ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                                            </button>
                                        </div>

                                        {/* AI Analysis Result */}
                                        {analysis && (
                                            <div className="mt-3 bg-indigo-900/20 p-3 rounded-lg border border-indigo-500/20 text-xs animate-fade-in ml-6">
                                                <div className="flex items-start gap-2 mb-2">
                                                    <AlertCircle size={12} className="text-indigo-400 mt-0.5 shrink-0" />
                                                    <p className="text-indigo-200 leading-snug">{analysis.analysis}</p>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <ArrowRight size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                                                    <p className="text-emerald-300 font-medium leading-snug">{analysis.recommendedAction}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            
                            {/* Empty state placeholder for visual feedback during drag */}
                            {dragOverStage === stage && deals.filter(d => d.stage === stage).length === 0 && (
                                <div className="h-24 border-2 border-dashed border-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-500/40 text-sm">
                                    Drop here
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Deals;