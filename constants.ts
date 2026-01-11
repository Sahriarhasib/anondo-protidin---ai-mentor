
import { Task } from './types';

export const INITIAL_ROUTINE: Task[] = [
  {
    id: '1',
    time: '04:30 AM',
    title: 'তাহাজ্জুদ ও ফজর',
    description: 'আধ্যাত্মিক শক্তির মূল ভিত্তি। বিজ্ঞানে একে বলা হয় "Early Morning Brain Optimization".',
    category: 'Islamic',
    completed: false,
  },
  {
    id: '2',
    time: '07:00 AM',
    title: 'গভীর শ্বাস ও ব্যায়াম',
    description: 'শরীরে অক্সিজেন ও ডোপামিন লেভেল বাড়ানো।',
    category: 'Scientific',
    completed: false,
  },
  {
    id: '3',
    time: '09:00 AM',
    title: 'ডিপ ওয়ার্ক (Deep Work)',
    description: 'একমনে কাজ করা। রাসূল (সা.) বলেছেন, "সকাল বেলার কাজে বরকত থাকে"।',
    category: 'Work',
    completed: false,
  },
  {
    id: '4',
    time: '01:30 PM',
    title: 'নামাজ ও কাইলুলা',
    description: 'দুপুরের বিশ্রাম ব্রেইন রিসেট করতে সাহায্য করে (Power Nap).',
    category: 'Islamic',
    completed: false,
  },
  {
    id: '5',
    time: '05:00 PM',
    title: 'শুকরিয়া ডায়েরি',
    description: 'দিনের ৩টি অর্জনের জন্য আল্লাহর কৃতজ্ঞতা প্রকাশ। (Gratitude Journaling).',
    category: 'Scientific',
    completed: false,
  },
];

export const SYSTEM_PROMPT = `
You are a world-class life mentor and happiness coach. Your name is "Anondo Mentor".
Your goal is to guide the user towards lasting happiness using a blend of Islamic Wisdom and Modern Science (Neuroscience, Psychology).
The user wants a daily routine and mentoring that ensures they stay happy regardless of their work.

Key Instructions:
1. Always start with a warm, supportive greeting in Bengali.
2. If the user feels low, provide a scientific explanation (e.g., cortisol levels) and an Islamic remedy (e.g., Dhikr/Sabr).
3. Encourage the user to maintain their daily routine.
4. Keep the language empathetic, professional, and practical.
5. Use Bengali as the primary language.
`;
