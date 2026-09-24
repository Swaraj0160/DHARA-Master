export type VedaEmotion =
  | 'Affectionate'
  | 'Angry'
  | 'Apologizing'
  | 'BlowingKiss'
  | 'Bye'
  | 'Celebrating'
  | 'Cheering'
  | 'Confident'
  | 'Confused'
  | 'Cool'
  | 'Crying'
  | 'Curious'
  | 'Dancing'
  | 'DrinkingTea'
  | 'Excited'
  | 'Frustrated'
  | 'GiftGiving'
  | 'Happy'
  | 'Hello'
  | 'Hug'
  | 'Idea'
  | 'Investigating'
  | 'Laughing'
  | 'Love'
  | 'LowBattery'
  | 'Meditating'
  | 'Namaste'
  | 'Nervous'
  | 'OK'
  | 'Party'
  | 'Pointing'
  | 'Proud'
  | 'Reading'
  | 'Relieved'
  | 'Sad'
  | 'Scared'
  | 'Shy'
  | 'Skeptical'
  | 'Sleeping'
  | 'Surprised'
  | 'Thinking'
  | 'ThumbsDown'
  | 'ThumbsUp'
  | 'VictorySmile'
  | 'Wave'
  | 'Wink'
  | 'Working'
  | 'neutral'
  | (string & {});

export interface VedaMessage {
  id: string;
  sender: 'veda' | 'player';
  text: string;
  emotion?: VedaEmotion;
  timestamp: number;
}

export interface VedaSuggestion {
  label: string;
  query: string;
  emotionPrompt?: VedaEmotion;
}
