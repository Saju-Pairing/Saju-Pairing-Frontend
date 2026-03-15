export interface PersonInput { 
  name: string; 
  gender: 'F' | 'M'; 
  date: string; 
  time: string; 
  isUnknownTime: boolean; 
}

export interface FortuneFlow { 
  daeUnPillar: string; 
  daeUnAge: string; 
  seUnPillar: string; 
  seUnYear: string; 
  wolUnPillar: string; 
  wolUnMonth: string; 
}

export interface SajuResult { 
  year: string; 
  month: string; 
  day: string; 
  hour: string; 
  elements: Record<string, number>; 
  totalChars: number; 
  fortune: FortuneFlow; 
}

export interface RawSaju {
  yearPillarHanja?: string | null;
  monthPillarHanja?: string | null;
  dayPillarHanja?: string | null;
  hourPillarHanja?: string | null;
}

export interface RelationResult {
  hapTitle: string;
  hapDesc: string;
  chungTitle: string;
  chungDesc: string;
  finalScore: number;
}