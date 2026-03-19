import { useState, useEffect } from 'react';
import { generateUserFlow } from '../api/openai';

export default function KanbanBoard({ projectTitle, projectDescription }) {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState({});
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedColumn, setDraggedColumn] = useState(null);

  useEffect(() => {
    if (projectTitle && projectDescription) {
      generateFlowData();
    }
  }, [projectTitle, projectDescription]);

  const generateFlowData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await generateUserFlow(projectTitle, projectDescription);
      if (data.error) {
        setError(data.error);
        return;
      }
      setColumns(data.userFlow.columns);
      setMetrics(data.userFlow.metrics);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDragStart = (e, cardId, columnId) => {
    setDraggedCard(cardId);
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    if (!draggedCard || !draggedColumn) return;

    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      
      // Find source and target columns
      const sourceColumnIndex = newColumns.findIndex(col => col.id === draggedColumn);
      const targetColumnIndex = newColumns.findIndex(col => col.id === targetColumnId);
      
      if (sourceColumnIndex === -1 || targetColumnIndex === -1) return prevColumns;
      
      // Find the card in source column
      const sourceColumn = newColumns[sourceColumnIndex];
      const cardIndex = sourceColumn.cards.findIndex(card => card.id === draggedCard);
      
      if (cardIndex === -1) return prevColumns;
      
      // Remove card from source column
      const [movedCard] = sourceColumn.cards.splice(cardIndex, 1);
      
      // Add card to target column
      newColumns[targetColumnIndex].cards.push(movedCard);
      
      return newColumns;
    });
    
    setDraggedCard(null);
    setDraggedColumn(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTagColor = (tag) => {
    const colors = {
      'marketing': 'bg-blue-100 text-blue-800',
      'conversion': 'bg-green-100 text-green-800',
      'onboarding': 'bg-purple-100 text-purple-800',
      'authentication': 'bg-red-100 text-red-800',
      'education': 'bg-yellow-100 text-yellow-800',
      'retention': 'bg-indigo-100 text-indigo-800',
      'security': 'bg-red-100 text-red-800',
      'verification': 'bg-orange-100 text-orange-800',
      'analytics': 'bg-pink-100 text-pink-800',
      'overview': 'bg-gray-100 text-gray-800',
      'creation': 'bg-emerald-100 text-emerald-800',
      'planning': 'bg-orange-100 text-orange-800',
      'ai': 'bg-cyan-100 text-cyan-800',
      'automation': 'bg-violet-100 text-violet-800',
      'templates': 'bg-teal-100 text-teal-800',
      'inspiration': 'bg-fuchsia-100 text-fuchsia-800',
      'research': 'bg-amber-100 text-amber-800',
      'validation': 'bg-lime-100 text-lime-800',
      'strategy': 'bg-rose-100 text-rose-800',
      'technical': 'bg-slate-100 text-slate-800',
      'architecture': 'bg-stone-100 text-stone-800',
      'pricing': 'bg-emerald-100 text-emerald-800',
      'business': 'bg-blue-100 text-blue-800',
      'development': 'bg-teal-100 text-teal-800',
      'mvp': 'bg-fuchsia-100 text-fuchsia-800',
      'quality': 'bg-sky-100 text-sky-800',
      'testing': 'bg-cyan-100 text-cyan-800',
      'launch': 'bg-emerald-100 text-emerald-800',
      'deployment': 'bg-orange-100 text-orange-800',
      'feedback': 'bg-indigo-100 text-indigo-800'
    };
    return colors[tag] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading user flow</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Metrics Header */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#18181b] rounded-lg p-4 border border-[#232329]">
          <div className="text-sm text-gray-400">Total Steps</div>
          <div className="text-2xl font-bold text-white">{metrics.totalSteps}</div>
        </div>
        <div className="bg-[#18181b] rounded-lg p-4 border border-[#232329]">
          <div className="text-sm text-gray-400">Estimated Time</div>
          <div className="text-2xl font-bold text-white">{metrics.estimatedTime}</div>
        </div>
        <div className="bg-[#18181b] rounded-lg p-4 border border-[#232329]">
          <div className="text-sm text-gray-400">Success Rate</div>
          <div className="text-2xl font-bold text-white">{metrics.successRate}</div>
        </div>
        <div className="bg-[#18181b] rounded-lg p-4 border border-[#232329]">
          <div className="text-sm text-gray-400">Conversion Rate</div>
          <div className="text-2xl font-bold text-white">{metrics.conversionRate}</div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="bg-[#18181b] rounded-lg border border-[#232329]">
              {/* Column Header */}
              <div 
                className="p-4 border-b border-[#232329] rounded-t-lg"
                style={{ backgroundColor: column.color + '20' }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{column.title}</h3>
                  <span className="bg-[#232329] text-white text-xs px-2 py-1 rounded-full">
                    {column.cards.length}
                  </span>
                </div>
              </div>

              {/* Column Cards */}
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {column.cards.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id, column.id)}
                    className="bg-[#232324] rounded-lg p-4 border border-[#333] cursor-move hover:border-[#555] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white text-sm">{card.title}</h4>
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(card.priority)}`}></div>
                    </div>
                    
                    <p className="text-gray-400 text-xs mb-3">{card.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">{card.estimatedTime}</div>
                      <div className="flex flex-wrap gap-1">
                        {card.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`text-xs px-2 py-1 rounded-full ${getTagColor(tag)}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}