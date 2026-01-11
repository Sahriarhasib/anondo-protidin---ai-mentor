
export interface Task {
  id: string;
  time: string;
  title: string;
  description: string;
  category: 'Islamic' | 'Scientific' | 'Work';
  completed: boolean;
}

export interface MoodEntry {
  date: string;
  score: number; // 1 to 5
  note: string;
}

export interface MentorMessage {
  role: 'user' | 'model';
  text: string;
}
