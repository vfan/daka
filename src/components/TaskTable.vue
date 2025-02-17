<template>
  <div class="w-full max-w-6xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">三年级每周任务表</h1>
    
    <!-- 添加周切换控件 -->
    <div class="flex items-center justify-between mb-4">
      <button 
        @click="switchWeek(-1)"
        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center"
        :disabled="currentWeekIndex <= 0"
      >
        <span class="mr-1">←</span> 上一周
      </button>
      
      <div class="bg-yellow-400 px-8 py-4 rounded-lg">
        <h2 class="text-xl font-bold">
          {{ currentWeek.name }} ({{ currentWeek.startDate }}-{{ currentWeek.endDate }})
        </h2>
      </div>
      
      <button 
        @click="switchWeek(1)"
        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center"
        :disabled="currentWeekIndex >= taskData.weeks.length - 1"
      >
        下一周 <span class="ml-1">→</span>
      </button>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 border border-gray-200">
        <colgroup>
          <col class="w-24"> <!-- 类别列 -->
          <col class="w-96"> <!-- 任务列 -->
          <col class="w-32"> <!-- 完成时间列 -->
          <col class="w-24"> <!-- 单项积分列 -->
          <col span="7" class="w-20"> <!-- 周一至周日列 -->
          <col class="w-24"> <!-- 总积分列 -->
        </colgroup>
        <thead>
          <tr class="divide-x divide-gray-200">
            <th class="border border-gray-200 bg-gray-50 p-3 text-left font-semibold whitespace-nowrap">类别</th>
            <th class="border border-gray-200 bg-gray-50 p-3 text-left font-semibold">任务</th>
            <th class="border border-gray-200 bg-gray-50 p-3 text-left font-semibold whitespace-nowrap">完成时间</th>
            <th class="border border-gray-200 bg-gray-50 p-3 text-center font-semibold whitespace-nowrap">单项积分</th>
            <th v-for="day in 7" :key="day" class="border border-gray-200 bg-gray-50 p-3 text-center font-semibold whitespace-nowrap">
              周{{ ["一","二","三","四","五","六","日"][day-1] }}
            </th>
            <th class="border border-gray-200 bg-gray-50 p-3 text-center font-semibold whitespace-nowrap">总积分</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="(tasks, category) in groupedTasks" :key="category">
            <td colspan="11" class="border border-gray-200 p-3 font-bold bg-gray-50">
              {{ category }}
            </td>
          </tr>
          <tr v-for="task in tasks" :key="task.id" class="divide-x divide-gray-200 hover:bg-gray-50">
            <td class="border border-gray-200 p-3 whitespace-nowrap">{{ task.category }}</td>
            <td class="border border-gray-200 p-3 whitespace-pre-line">{{ task.name }}</td>
            <td class="border border-gray-200 p-3 whitespace-nowrap">{{ task.duration || "-" }}</td>
            <td class="border border-gray-200 p-3 text-center whitespace-nowrap">{{ task.points }}</td>
            <td v-for="day in 7" :key="day" class="border border-gray-200 p-3 text-center">
              <input 
                type="checkbox" 
                v-model="taskStatus[task.id][day-1]"
                class="w-5 h-5 cursor-pointer accent-blue-600"
                @change="saveToLocalStorage"
              >
            </td>
            <td class="border border-gray-200 p-3 text-center font-medium whitespace-nowrap">
              {{ calculateTaskPoints(task) }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="divide-x divide-gray-200">
            <td colspan="4" class="border border-gray-200 p-3 text-right font-bold bg-gray-50 whitespace-nowrap">
              每日总分
            </td>
            <td v-for="day in 7" :key="day" class="border border-gray-200 p-3 text-center font-bold bg-gray-50">
              {{ calculateDayPoints(day-1) }}
            </td>
            <td class="border border-gray-200 p-3 text-center font-bold bg-gray-50 text-blue-600 text-lg">
              {{ totalPoints }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import taskData from "../data/tasks.json";

// 当前周索引
const currentWeekIndex = ref(1); // 默认显示第二周

// 当前周信息
const currentWeek = computed(() => taskData.weeks[currentWeekIndex.value]);

// 切换周
const switchWeek = (direction: number) => {
  const newIndex = currentWeekIndex.value + direction;
  if (newIndex >= 0 && newIndex < taskData.weeks.length) {
    currentWeekIndex.value = newIndex;
    loadWeekData();
  }
};

// 任务状态存储键
const getStorageKey = (weekId: number) => `taskStatus_week_${weekId}`;

// 将任务数据转换为响应式
const taskInfo = ref(taskData.weekInfo);
const tasks = ref(taskData.tasks);

interface TaskStatus {
  [key: number]: boolean[];
}

// 初始化任务状态
const initTaskStatus = (): TaskStatus => {
  const status: TaskStatus = {};
  tasks.value.forEach(task => {
    status[task.id] = Array(7).fill(false);
  });
  return status;
};

const taskStatus = ref<TaskStatus>(initTaskStatus());

// 从 localStorage 加载数据
const loadWeekData = () => {
  const savedData = localStorage.getItem(getStorageKey(currentWeek.value.id));
  if (savedData) {
    taskStatus.value = JSON.parse(savedData);
  } else {
    taskStatus.value = initTaskStatus();
  }
};

// 保存数据到 localStorage
const saveToLocalStorage = () => {
  localStorage.setItem(
    getStorageKey(currentWeek.value.id), 
    JSON.stringify(taskStatus.value)
  );
};

// 在组件挂载时加载数据
loadWeekData();

// 按类别分组任务
const groupedTasks = computed(() => {
  return tasks.value.reduce((groups: { [key: string]: typeof tasks.value }, task) => {
    if (!groups[task.category]) {
      groups[task.category] = [];
    }
    groups[task.category].push(task);
    return groups;
  }, {});
});

// 计算单个任务的总分
const calculateTaskPoints = (task: typeof tasks.value[0]) => {
  return taskStatus.value[task.id].filter(Boolean).length * task.points;
};

// 计算某一天的总分
const calculateDayPoints = (dayIndex: number) => {
  return tasks.value.reduce((sum, task) => {
    return sum + (taskStatus.value[task.id][dayIndex] ? task.points : 0);
  }, 0);
};

// 计算总分
const totalPoints = computed(() => {
  return tasks.value.reduce((sum, task) => {
    return sum + calculateTaskPoints(task);
  }, 0);
});
</script>

<script lang="ts">
export default {
  name: 'TaskTable'
}
</script>

<style>
table {
  border-collapse: separate;
  border-spacing: 0;
}

/* 确保表格不会在小屏幕上变形 */
@media (max-width: 1024px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
}

/* 禁用按钮样式 */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 