import React, { useState, useRef, useCallback, useEffect } from 'react';

// 并发测试任务状态
const TASK_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  SUCCESS: 'success',
  ERROR: 'error',
  CANCELLED: 'cancelled'
};

// 图片生成测试提示词列表
const TEST_PROMPTS = [
  '一只可爱的橘猫在阳光下睡觉',
  '未来城市的夜景,霓虹灯闪烁,飞行汽车穿梭其中',
  '一幅中国山水画,有瀑布、松树和云雾',
  '一个穿着宇航服的兔子在月球表面',
  '春天的樱花树下,一对情侣在散步',
  '赛博朋克风格的街景,有日式建筑和全息广告',
  '一只金色的凤凰在火焰中飞翔',
  '童话森林中的小木屋,周围有蘑菇和精灵',
  '现代极简风格的客厅设计,大窗户和绿植',
  '一只戴着礼帽的企鹅在弹钢琴',
  '热带海滩的日落景色,椰子树和海浪',
  '复古风格的咖啡馆,有老式收音机和黑胶唱片',
  '一个巨大的机械时钟,内部有齿轮和星空',
  '冬季雪景,有小鹿和木屋,炊烟袅袅',
  '抽象艺术风格的彩色几何图案背景'
];

// 单个任务组件
const ConcurrencyTask = ({ task, onCancel }) => {
  const getStatusColor = () => {
    switch (task.status) {
      case TASK_STATUS.PENDING:
        return 'bg-gray-300';
      case TASK_STATUS.RUNNING:
        return 'bg-blue-500 animate-pulse';
      case TASK_STATUS.SUCCESS:
        return 'bg-green-500';
      case TASK_STATUS.ERROR:
        return 'bg-red-500';
      case TASK_STATUS.CANCELLED:
        return 'bg-yellow-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusText = () => {
    switch (task.status) {
      case TASK_STATUS.PENDING:
        return '等待中';
      case TASK_STATUS.RUNNING:
        return '生成中...';
      case TASK_STATUS.SUCCESS:
        return '完成';
      case TASK_STATUS.ERROR:
        return '失败';
      case TASK_STATUS.CANCELLED:
        return '已取消';
      default:
        return '未知';
    }
  };

  return (
    <div className={`rounded-lg border p-3 transition-all duration-200 ${
      task.status === TASK_STATUS.RUNNING ? 'border-blue-400 bg-blue-50' :
      task.status === TASK_STATUS.SUCCESS ? 'border-green-400 bg-green-50' :
      task.status === TASK_STATUS.ERROR ? 'border-red-400 bg-red-50' :
      'border-gray-300 bg-white'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span className="text-sm font-medium text-gray-700">任务 #{task.id}</span>
        </div>
        <div className="flex items-center gap-2">
          {task.status === TASK_STATUS.RUNNING && (
            <button
              onClick={() => onCancel(task.id)}
              className="text-xs text-red-600 hover:text-red-700 transition-colors"
            >
              取消
            </button>
          )}
          <span className="text-xs font-mono text-gray-500">{getStatusText()}</span>
        </div>
      </div>
      
      {task.startTime && (
        <div className="text-xs text-gray-500 mb-1">
          开始时间: {new Date(task.startTime).toLocaleTimeString()}
        </div>
      )}
      
      {task.duration && (
        <div className="text-xs text-gray-500 mb-1">
          耗时: {task.duration}ms
        </div>
      )}
      
      {task.errorMessage && (
        <div className="text-xs text-red-600 mt-1 p-1 bg-red-100 rounded">
          {task.errorMessage}
        </div>
      )}
      
      {task.output && task.output.length > 0 && (
        <div className="mt-2 space-y-2">
          <div className="text-xs text-gray-500">
            生成图片: {task.output.length} 张
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {task.output.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`生成图片 ${idx + 1}`}
                className="w-full h-24 object-cover rounded border border-gray-200"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 统计信息组件
const Statistics = ({ stats }) => {
  const statsCards = [
    {
      label: '总任务数',
      value: stats.total,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: '成功',
      value: stats.success,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: '失败',
      value: stats.error,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      label: '运行中',
      value: stats.running,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      label: '平均耗时',
      value: stats.avgDuration ? `${stats.avgDuration}ms` : '-',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      label: '成功率',
      value: stats.successRate ? `${stats.successRate}%` : '-',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
      {statsCards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} ${card.borderColor} border rounded-lg p-3 text-center`}
        >
          <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
          <div className="text-xs text-gray-600 mt-1">{card.label}</div>
        </div>
      ))}
    </div>
  );
};

export default function ImageConcurrencyTest() {
  // 配置状态
  const [model, setModel] = useState('gemini-2.5-flash-image-preview');
  const [concurrency, setConcurrency] = useState(5);
  const [promptTemplate, setPromptTemplate] = useState(TEST_PROMPTS[0]);
  const [useRandomPrompts, setUseRandomPrompts] = useState(false);
  
  // 测试状态
  const [tasks, setTasks] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    error: 0,
    running: 0,
    avgDuration: 0,
    successRate: 0
  });

  const abortControllersRef = useRef({});
  const startTimeRef = useRef({});

  // 获取 API Key
  const getApiKey = useCallback(() => {
    return '';
  }, []);

  // 计算统计信息
  const calculateStats = useCallback((currentTasks) => {
    const completed = currentTasks.filter(t =>
      t.status === TASK_STATUS.SUCCESS || t.status === TASK_STATUS.ERROR
    );
    const successCount = currentTasks.filter(t => t.status === TASK_STATUS.SUCCESS).length;
    const errorCount = currentTasks.filter(t => t.status === TASK_STATUS.ERROR).length;
    const runningCount = currentTasks.filter(t => t.status === TASK_STATUS.RUNNING).length;
    const avgDuration = completed.length > 0
      ? Math.round(completed.reduce((sum, t) => sum + (t.duration || 0), 0) / completed.length)
      : 0;
    const successRate = completed.length > 0
      ? ((successCount / completed.length) * 100).toFixed(1)
      : 0;

    return {
      total: currentTasks.length,
      success: successCount,
      error: errorCount,
      running: runningCount,
      avgDuration,
      successRate
    };
  }, []);

  // 单个图片生成任务执行函数
  const executeTask = useCallback(async (taskId, prompt, signal) => {
    const startTime = Date.now();
    startTimeRef.current[taskId] = startTime;
    const apiKey = getApiKey();

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      
      const requestBody = {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE']
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(requestBody),
        signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const blockReason = errorData.promptFeedback?.blockReason;
        if (blockReason) {
          throw new Error(`内容被安全过滤器拦截: ${blockReason}`);
        }
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const responseParts = data.candidates?.[0]?.content?.parts || [];
      
      let accumulatedText = '';
      let accumulatedImages = [];

      for (const part of responseParts) {
        if (part.text) {
          accumulatedText += part.text;
        }
        
        const imgData = part.inlineData || part.inline_data;
        if (imgData) {
          const mimeType = imgData.mimeType || imgData.mime_type;
          const imageData = imgData.data;
          accumulatedImages.push({
            mimeType: mimeType,
            data: imageData,
            url: `data:${mimeType};base64,${imageData}`
          });
        }
      }

      const duration = Date.now() - startTime;

      setTasks(prev => {
        const updated = prev.map(t =>
          t.id === taskId
            ? { 
                ...t, 
                status: TASK_STATUS.SUCCESS, 
                output: accumulatedImages,
                outputText: accumulatedText,
                imageCount: accumulatedImages.length,
                duration, 
                endTime: Date.now() 
              }
            : t
        );
        setStats(calculateStats(updated));
        return updated;
      });
    } catch (error) {
      if (signal.aborted) {
        setTasks(prev => {
          const updated = prev.map(t =>
            t.id === taskId
              ? { ...t, status: TASK_STATUS.CANCELLED, endTime: Date.now() }
              : t
          );
          setStats(calculateStats(updated));
          return updated;
        });
        return;
      }

      const duration = Date.now() - startTime;
      setTasks(prev => {
        const updated = prev.map(t =>
          t.id === taskId
            ? { ...t, status: TASK_STATUS.ERROR, errorMessage: error.message, duration, endTime: Date.now() }
            : t
        );
        setStats(calculateStats(updated));
        return updated;
      });
    }
  }, [getApiKey, model, calculateStats]);

  // 开始测试
  const startTest = useCallback(async () => {
    setIsRunning(true);
    const newTasks = [];

    // 创建任务
    for (let i = 0; i < concurrency; i++) {
      const prompt = useRandomPrompts
        ? TEST_PROMPTS[i % TEST_PROMPTS.length]
        : promptTemplate;
      
      newTasks.push({
        id: i,
        prompt,
        status: TASK_STATUS.RUNNING,
        startTime: Date.now()
      });
    }

    setTasks(newTasks);
    setStats(calculateStats(newTasks));

    // 并发执行所有任务
    const controllers = {};
    const promises = newTasks.map(task => {
      const controller = new AbortController();
      controllers[task.id] = controller;
      return executeTask(task.id, task.prompt, controller.signal);
    });

    abortControllersRef.current = controllers;

    // 等待所有任务完成
    await Promise.allSettled(promises);
    setIsRunning(false);
  }, [concurrency, promptTemplate, useRandomPrompts, executeTask, calculateStats]);

  // 取消单个任务
  const cancelTask = useCallback((taskId) => {
    const controller = abortControllersRef.current[taskId];
    if (controller) {
      controller.abort();
      delete abortControllersRef.current[taskId];
    }
  }, []);

  // 停止所有测试
  const stopAll = useCallback(() => {
    Object.values(abortControllersRef.current).forEach(controller => {
      controller.abort();
    });
    abortControllersRef.current = {};
    setIsRunning(false);
  }, []);

  // 清空结果
  const clearResults = useCallback(() => {
    stopAll();
    setTasks([]);
    setStats({
      total: 0,
      success: 0,
      error: 0,
      running: 0,
      avgDuration: 0,
      successRate: 0
    });
  }, [stopAll]);

  // 导出测试报告
  const exportReport = useCallback(() => {
    const report = {
      timestamp: new Date().toISOString(),
      config: {
        model,
        concurrency,
        useRandomPrompts
      },
      statistics: stats,
      tasks: tasks.map(t => ({
        id: t.id,
        status: t.status,
        duration: t.duration,
        imageCount: t.imageCount,
        error: t.errorMessage
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-concurrency-test-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [model, concurrency, useRandomPrompts, stats, tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎨 图片生成并发测试工具
          </h1>
          <p className="text-gray-600">
            测试 AI 图片生成功能的并发极限
          </p>
        </div>

        {/* 配置面板 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            测试配置
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* 模型选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                模型
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isRunning}
              >
                <option value="gemini-2.5-flash-image-preview">Gemini 2.5 Flash Image</option>
              </select>
            </div>

            {/* 并发数量 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                并发数量
              </label>
              <input
                type="number"
                value={concurrency}
                onChange={(e) => setConcurrency(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isRunning}
              />
            </div>

            {/* 使用随机提示词 */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useRandomPrompts}
                  onChange={(e) => setUseRandomPrompts(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  disabled={isRunning}
                />
                <span className="text-sm text-gray-700">使用随机提示词池 (15个不同提示词循环)</span>
              </label>
            </div>

            {/* 提示词模板 */}
            {!useRandomPrompts && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  提示词模板
                </label>
                <textarea
                  value={promptTemplate}
                  onChange={(e) => setPromptTemplate(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  disabled={isRunning}
                />
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={startTest}
              disabled={isRunning}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-medium transition-all ${
                isRunning
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg'
              }`}
            >
              {isRunning ? '测试中...' : '▶ 开始测试'}
            </button>
            
            {isRunning && (
              <button
                onClick={stopAll}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
              >
                ⏹ 停止全部
              </button>
            )}

            <button
              onClick={clearResults}
              disabled={isRunning}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                isRunning
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🗑 清空
            </button>

            {tasks.length > 0 && (
              <button
                onClick={exportReport}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
              >
                📊 导出报告
              </button>
            )}
          </div>
        </div>

        {/* 统计信息 */}
        {tasks.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18"/>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
              </svg>
              实时统计
            </h2>
            <Statistics stats={stats} />
          </div>
        )}

        {/* 任务列表 */}
        {tasks.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              任务列表 ({tasks.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-2">
              {tasks.map(task => (
                <ConcurrencyTask
                  key={task.id}
                  task={task}
                  onCancel={cancelTask}
                />
              ))}
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            使用说明
          </h2>
          <div className="text-sm text-gray-700 space-y-2">
            <p>1. <strong>选择模型</strong>: 选择要测试的图片生成模型</p>
            <p>2. <strong>设置并发数量</strong>: 建议从 5 开始,图片生成较为消耗资源</p>
            <p>3. <strong>配置提示词</strong>: 描述你想要生成的图片内容</p>
            <p>4. <strong>开始测试</strong>: 点击"开始测试"按钮,观察实时统计</p>
            <p>5. <strong>分析结果</strong>: 查看成功率、平均耗时和生成的图片</p>
            <p className="mt-2 text-yellow-700 bg-yellow-50 p-2 rounded">
              ⚠️ 注意: 图片生成需要较长时间,并发数量过高可能触发 API 限流
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
