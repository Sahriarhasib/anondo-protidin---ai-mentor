
import React, { useState, useEffect, useRef } from 'react';
import { Task, MentorMessage } from './types';
import { INITIAL_ROUTINE } from './constants';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'routine' | 'mentor' | 'tracker'>('routine');
  const [showInfo, setShowInfo] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : INITIAL_ROUTINE;
  });
  const [messages, setMessages] = useState<MentorMessage[]>([
    { role: 'model', text: 'আসসালামু আলাইকুম! আমি আপনার "আনন্দ মেন্টর"। আজ আপনার মনের অবস্থা কেমন? আমাকে সব খুলে বলতে পারেন।' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: MentorMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await geminiService.chat(messages, input);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-slate-50 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="bg-indigo-600 p-6 text-white text-center rounded-b-[40px] shadow-xl z-20 relative">
        <button 
          onClick={() => setShowInfo(true)}
          className="absolute right-6 top-8 text-indigo-100 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Anondo Protidin</h1>
        <p className="text-indigo-100 text-sm font-medium opacity-90 mt-1">আপনার পার্সোনাল AI মেন্টর</p>
      </header>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setShowInfo(false)}>
          <div className="bg-white rounded-[32px] p-8 max-w-xs w-full shadow-2xl animate-fadeIn" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">অ্যাপটি কোথায় পাবো?</h2>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              ১. <strong>লিঙ্ক সেভ করুন:</strong> এই ব্রাউজারের অ্যাড্রেস বার থেকে লিঙ্কটি কপি করে আপনার প্রিয় মেসেঞ্জারে বা নোটে সেভ করে রাখুন।<br/><br/>
              ২. <strong>বুকমার্ক:</strong> ব্রাউজারের স্টার (★) আইকনে ক্লিক করে বুকমার্ক করে রাখুন।<br/><br/>
              ৩. <strong>হোম স্ক্রিন:</strong> ব্রাউজারের অপশন থেকে "Add to Home Screen" দিন, তাহলে এটি মোবাইলে আসল অ্যাপের মতো দেখাবে।
            </p>
            <button 
              onClick={() => setShowInfo(false)}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-2xl shadow-lg shadow-indigo-200"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-5 pb-28 pt-8">
        {activeTab === 'routine' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-2xl font-black text-gray-800">আজকের রুটিন</h2>
              <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase">
                {tasks.filter(t => t.completed).length} / {tasks.length} শেষ
              </span>
            </div>
            {tasks.map(task => (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-5 rounded-3xl border-2 transition-all duration-300 transform active:scale-95 flex gap-4 items-start ${
                  task.completed 
                    ? 'bg-green-50 border-green-200 opacity-60' 
                    : 'bg-white border-white shadow-sm hover:shadow-md'
                }`}
              >
                <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  task.completed ? 'bg-green-500 border-green-500' : 'border-gray-200 bg-gray-50'
                }`}>
                  {task.completed && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">{task.time}</span>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">{task.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{task.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'mentor' && (
          <div className="flex flex-col h-full space-y-4 animate-fadeIn">
            <div className="flex-1 space-y-4 pb-24">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] p-4 rounded-3xl shadow-sm text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200/50 p-4 rounded-3xl animate-pulse text-xs text-gray-500 font-bold">মেন্টর চিন্তা করছেন...</div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>
        )}

        {activeTab === 'tracker' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[40px] text-center text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <h2 className="text-lg font-bold opacity-80 uppercase tracking-widest">হ্যাপিনেস লেভেল</h2>
              <div className="text-7xl font-black my-4 drop-shadow-lg">
                {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%
              </div>
              <p className="text-sm font-medium italic opacity-90 px-4">"ধৈর্য ধরুন, আল্লাহ ধৈর্যশীলদের সাথে আছেন"</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-3xl border border-gray-50 shadow-sm">
                <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
                </div>
                <p className="text-[10px] text-orange-600 font-black uppercase mb-1">হিকমাহ</p>
                <p className="text-xs font-bold text-gray-700 leading-tight">শুরুটা হোক বিসমিল্লাহ দিয়ে।</p>
              </div>
              <div className="p-5 bg-white rounded-3xl border border-gray-50 shadow-sm">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
                </div>
                <p className="text-[10px] text-blue-600 font-black uppercase mb-1">বিজ্ঞান</p>
                <p className="text-xs font-bold text-gray-700 leading-tight">পর্যাপ্ত পানি ব্রেইন ফাংশন বাড়ায়।</p>
              </div>
            </div>

            <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2 mb-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                মেনটরের নোট
              </h3>
              <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                আপনি যদি আজ ৫০% কাজও শেষ করতে পারেন, তবে জানবেন আপনি অনেক মানুষের চেয়ে এগিয়ে আছেন। আলহামদুলিল্লাহ বলুন!
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Input bar for Mentor */}
      {activeTab === 'mentor' && (
        <div className="absolute bottom-20 left-0 right-0 p-4 bg-white/80 backdrop-blur-md z-20 border-t border-gray-100">
          <div className="flex gap-2 max-w-md mx-auto">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="আপনার সমস্যার কথা খুলে বলুন..."
              className="flex-1 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading}
              className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 max-w-md w-full bg-white/90 backdrop-blur-lg border-t border-gray-50 flex justify-around p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] rounded-t-[40px] z-30">
        <button onClick={() => setActiveTab('routine')} className={`flex flex-col items-center p-2 px-4 rounded-2xl transition-all ${activeTab === 'routine' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">রুটিন</span>
        </button>
        <button onClick={() => setActiveTab('mentor')} className={`flex flex-col items-center p-2 px-4 rounded-2xl transition-all ${activeTab === 'mentor' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">মেন্টর</span>
        </button>
        <button onClick={() => setActiveTab('tracker')} className={`flex flex-col items-center p-2 px-4 rounded-2xl transition-all ${activeTab === 'tracker' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">অ্যাক্টিভিটি</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
