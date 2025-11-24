import React, { useState } from 'react';
import { Contact } from '../types';
import { Mail, Phone, Building, User, Sparkles, X, Loader2 } from 'lucide-react';
import { GeminiService } from '../services/geminiService';

interface ContactsProps {
  contacts: Contact[];
  onUpdateContact: (updated: Contact) => void;
}

const Contacts: React.FC<ContactsProps> = ({ contacts, onUpdateContact }) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [emailContext, setEmailContext] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');

  const handleGenerateEmail = async () => {
    if (!selectedContact || !emailContext) return;
    setIsGeneratingEmail(true);
    const draft = await GeminiService.generateEmailDraft(selectedContact, emailContext);
    setGeneratedDraft(draft);
    setIsGeneratingEmail(false);
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 relative">
      {/* Contact List */}
      <div className={`flex-1 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${selectedContact ? 'hidden md:block' : 'block'}`}>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Contacts</h2>
          <span className="text-sm text-slate-500">{contacts.length} records</span>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Name</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Company</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Email</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.map(contact => (
                <tr 
                  key={contact.id} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedContact(contact)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {contact.firstName[0]}{contact.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{contact.firstName} {contact.lastName}</p>
                        <p className="text-xs text-slate-500 sm:hidden">{contact.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell text-slate-600">{contact.company}</td>
                  <td className="p-4 hidden md:table-cell text-slate-600">{contact.email}</td>
                  <td className="p-4">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Contact Details / Slide-over */}
      {selectedContact && (
        <div className="w-full md:w-[400px] lg:w-[450px] bg-white border-l border-slate-200 shadow-xl fixed md:sticky top-0 h-full right-0 z-20 flex flex-col md:rounded-xl md:h-[calc(100vh-120px)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xl font-bold text-indigo-600 shadow-sm">
                    {selectedContact.firstName[0]}{selectedContact.lastName[0]}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedContact.firstName} {selectedContact.lastName}</h2>
                    <p className="text-slate-500">{selectedContact.position} at {selectedContact.company}</p>
                </div>
              </div>
              <button onClick={() => setSelectedContact(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-1 gap-4 text-sm">
                    <div className="flex items-center gap-3 text-slate-600">
                        <Mail size={16} className="text-slate-400" />
                        <a href={`mailto:${selectedContact.email}`} className="hover:text-indigo-600">{selectedContact.email}</a>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                        <Phone size={16} className="text-slate-400" />
                        <span>{selectedContact.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                        <Building size={16} className="text-slate-400" />
                        <span>{selectedContact.company}</span>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* Notes */}
                <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Notes</h3>
                    <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {selectedContact.notes}
                    </p>
                </div>

                <hr className="border-slate-100" />

                {/* AI Helper Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-indigo-600" />
                        <h3 className="font-semibold text-indigo-900">AI Email Assistant</h3>
                    </div>
                    
                    {!generatedDraft ? (
                        <>
                            <textarea
                                className="w-full text-sm p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-3 bg-white"
                                rows={3}
                                placeholder="What is this email about? (e.g. following up on last week's meeting)"
                                value={emailContext}
                                onChange={(e) => setEmailContext(e.target.value)}
                            />
                            <button
                                onClick={handleGenerateEmail}
                                disabled={!emailContext || isGeneratingEmail}
                                className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isGeneratingEmail ? <Loader2 className="animate-spin" size={16} /> : 'Generate Draft'}
                            </button>
                        </>
                    ) : (
                        <div className="space-y-3">
                            <div className="bg-white p-3 rounded-lg border border-indigo-200 text-sm text-slate-700 whitespace-pre-wrap">
                                {generatedDraft}
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => {navigator.clipboard.writeText(generatedDraft); alert("Copied!")}}
                                    className="flex-1 bg-white border border-indigo-200 text-indigo-700 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50"
                                >
                                    Copy
                                </button>
                                <button 
                                    onClick={() => setGeneratedDraft('')}
                                    className="px-4 text-slate-500 text-sm hover:text-slate-700"
                                >
                                    Discard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
