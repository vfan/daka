export interface Achievement {
  level: string;
  title: string;
  description: string;
  minPoints: number;
  color: string;
}

export const achievements: Achievement[] = [
  {
    level: "初学小萌新",
    title: "继续加油哦！",
    description: "这周刚刚起步，相信下周会更好！",
    minPoints: 0,
    color: "text-gray-600",
  },
  {
    level: "勤奋小学童",
    title: "不错的开始！",
    description: "已经完成了不少任务，继续保持！",
    minPoints: 30,
    color: "text-green-600",
  },
  {
    level: "进步小达人",
    title: "太棒了！",
    description: "本周表现很出色，家长一定很欣慰！",
    minPoints: 60,
    color: "text-blue-600",
  },
  {
    level: "学习小超星",
    title: "哇！真厉害！",
    description: "你是最闪亮的小星星，继续保持这份热情！",
    minPoints: 90,
    color: "text-purple-600",
  },
  {
    level: "完美小天才",
    title: "太了不起了！",
    description: "你就是最棒的！这周简直完美！",
    minPoints: 120,
    color: "text-yellow-600",
  },
];
