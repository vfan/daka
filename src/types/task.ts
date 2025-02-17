export interface Task {
  id: number;
  category: "学习" | "生活"; // 类别
  name: string; // 任务名称
  duration?: string; // 完成时间
  points: number; // 单项积分
  completed: boolean; // 是否完成
}

export interface WeeklyTasks {
  startDate: string;
  endDate: string;
  tasks: Task[];
}
