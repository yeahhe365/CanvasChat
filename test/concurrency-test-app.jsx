import React, { useState, useRef, useCallback, useEffect } from 'react';

// 并发测试任务状态
const TASK_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  SUCCESS: 'success',
  ERROR: 'error',
  CANCELLED: 'cancelled'
};

// 测试提示词列表
const TEST_PROMPTS = [
  '请写一篇关于人工智能未来发展的短文,约200字。',
  '解释量子计算的基本原理及其潜在应用。',
  '描述一下区块链技术如何改变金融行业。',
  '写一篇关于气候变化对生态系统影响的分析。',
  '讨论机器学习在医疗诊断中的应用前景。',
  '阐述自动驾驶技术面临的伦理和法律挑战。',
  '分析社交媒体对现代社会人际关系的影响。',
  '写一篇关于太空探索重要性的议论文。',
  '解释深度学习与传统编程的区别和优势。',
  '讨论虚拟现实技术在教育领域的潜在价值。',
  '分析全球供应链中断的原因及解决方案。',
  '写一篇关于可再生能源发展趋势的报告。',
  '阐述网络安全在数字化转型中的重要性。',
  '讨论基因编辑技术的伦理边界。',
  '分析远程工作模式对企业文化的影响。'
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

      {task.outputLength && (
        <div className="text-xs text-gray-500 mb-1">
          生成字数: {task.outputLength}
        </div>
      )}

      {task.errorMessage && (
        <div className="text-xs text-red-600 mt-1 p-1 bg-red-100 rounded">
          {task.errorMessage}
        </div>
      )}

      {task.output && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700 max-h-20 overflow-y-auto font-mono whitespace-pre-wrap">
          {task.output.substring(0, 200)}
          {task.output.length > 200 && '...'}
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

export default function ConcurrencyTest() {
  // 配置状态
  const [model, setModel] = useState('gemini-3-flash-preview');
  const [concurrency, setConcurrency] = useState(10);
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

  // 获取 API Key (从环境变量或配置文件)
  const getApiKey = useCallback(() => {
    // 这里可以从环境变量、localStorage 或配置文件中获取
    // 例如: return process.env.REACT_APP_API_KEY || localStorage.getItem('api_key')
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

  // 单个请求执行函数
  const executeTask = useCallback(async (taskId, prompt, signal) => {
    const startTime = Date.now();
    startTimeRef.current[taskId] = startTime;
    const apiKey = getApiKey();

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        }),
        signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const output = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const duration = Date.now() - startTime;

      setTasks(prev => {
        const updated = prev.map(t =>
          t.id === taskId
            ? { ...t, status: TASK_STATUS.SUCCESS, output, outputLength: output.length, duration, endTime: Date.now() }
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
        outputLength: t.outputLength,
        error: t.errorMessage
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `concurrency-test-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [model, concurrency, useRandomPrompts, stats, tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🚀 语言模型并发测试工具
          </h1>
          <p className="text-gray-600">
            测试 AI 模型的文字生成并发极限
          </p>
        </div>

        {/* 配置面板 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isRunning}
              >
                <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
                <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
                <option value="gemini-2.5-flash-preview">Gemini 2.5 Flash</option>
                <option value="gemini-2.5-pro-preview">Gemini 2.5 Pro</option>
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
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
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
                <rect x="2" y="2" width="20" height="20" rx="2"/>
                <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5"/>
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
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            使用说明
          </h2>
          <div className="text-sm text-gray-700 space-y-2">
            <p>1. <strong>选择模型</strong>: 选择要测试的 Gemini 模型版本</p>
            <p>2. <strong>设置并发数量</strong>: 建议从 10 开始,逐步增加测试极限</p>
            <p>3. <strong>配置提示词</strong>: 可选择统一提示词或使用随机提示词池</p>
            <p>4. <strong>开始测试</strong>: 点击"开始测试"按钮,观察实时统计</p>
            <p>5. <strong>分析结果</strong>: 查看成功率、平均耗时等指标,评估并发极限</p>
            <p className="mt-2 text-yellow-700 bg-yellow-50 p-2 rounded">
              ⚠️ 注意: 并发数量过高可能触发 API 限流,请根据实际情况调整
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
