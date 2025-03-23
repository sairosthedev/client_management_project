import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Plus, Minus, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Block {
  id: string;
  type: 'text' | 'heading' | 'todo';
  content: string;
  checked?: boolean;
}

interface SortableBlockProps {
  block: Block;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onToggle?: (id: string) => void;
}

const SortableBlock: React.FC<SortableBlockProps> = ({ block, onUpdate, onDelete, onToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start group">
      <div
        {...attributes}
        {...listeners}
        className="cursor-move p-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex-1">
        {block.type === 'todo' ? (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={block.checked}
              onChange={() => onToggle?.(block.id)}
              className="rounded border-gray-300"
            />
            <input
              value={block.content}
              onChange={(e) => onUpdate(block.id, e.target.value)}
              className="flex-1 px-2 py-1 bg-transparent focus:outline-none focus:bg-gray-50 rounded"
              placeholder="To-do item..."
            />
          </div>
        ) : (
          <div className="relative">
            <textarea
              value={block.content}
              onChange={(e) => onUpdate(block.id, e.target.value)}
              className="w-full px-2 py-1 bg-transparent focus:outline-none focus:bg-gray-50 rounded resize-none overflow-hidden"
              placeholder={block.type === 'heading' ? 'Heading...' : 'Type something...'}
              style={{ minHeight: '1.5rem' }}
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
            <div className="hidden group-hover:flex absolute right-2 top-1/2 -translate-y-1/2 space-x-1">
              <button
                onClick={() => onDelete(block.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Minus className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const NotionEditor: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'heading', content: 'Welcome to the Notion-like Editor' },
    { id: '2', type: 'text', content: 'Start typing to create your document...' },
    { id: '3', type: 'todo', content: 'Add more features', checked: false },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setBlocks((blocks) => {
        const oldIndex = blocks.findIndex((block) => block.id === active.id);
        const newIndex = blocks.findIndex((block) => block.id === over.id);

        return arrayMove(blocks, oldIndex, newIndex);
      });
    }
  };

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: '',
      ...(type === 'todo' ? { checked: false } : {}),
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, content } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const toggleTodo = (id: string) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, checked: !block.checked } : block
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map(block => block.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                onUpdate={updateBlock}
                onDelete={deleteBlock}
                onToggle={toggleTodo}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => addBlock('text')}
          className="flex items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
        >
          <Plus className="w-4 h-4 mr-1" />
          Text
        </button>
        <button
          onClick={() => addBlock('heading')}
          className="flex items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
        >
          <Plus className="w-4 h-4 mr-1" />
          Heading
        </button>
        <button
          onClick={() => addBlock('todo')}
          className="flex items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
        >
          <Plus className="w-4 h-4 mr-1" />
          To-do
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-2">Preview</h3>
        <div className="prose">
          {blocks.map((block) => (
            <div key={block.id} className="mb-2">
              {block.type === 'heading' ? (
                <h2 className="text-xl font-bold">{block.content}</h2>
              ) : block.type === 'todo' ? (
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={block.checked} readOnly className="rounded" />
                  <span className={block.checked ? 'line-through text-gray-500' : ''}>
                    {block.content}
                  </span>
                </div>
              ) : (
                <ReactMarkdown>{block.content}</ReactMarkdown>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotionEditor;