<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-6xl mx-auto py-6 px-4">
        <h1 class="text-3xl font-bold text-gray-900">三年级每周任务表</h1>
      </div>
    </header>
    
    <main>
      <TaskTable />
    </main>
  </div>
</template>

<script setup lang="ts">
import TaskTable from "./components/TaskTable.vue";
</script> 