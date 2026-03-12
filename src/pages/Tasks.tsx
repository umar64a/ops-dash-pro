import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../hooks/reduxHooks';
import { v4 as uuid } from 'uuid';
import type { RootState } from '../store';
import { setTasks } from '../store/taskSlice';
import type { Task } from '../types/Task';
import { db } from '../services/db';
import { mergeSortGeneric } from '../algorithms/mergeSort';
import { quickSortGeneric } from '../algorithms/quickSort';
import { addTaskThunk, updateTaskThunk, deleteTaskThunk } from '../store/taskThunks';
import { useScrollFade } from '../hooks/useScrollFade';
import { statusConfig, priorityConfig } from '../utils/taskConfigs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faCircleCheck,
  faPlus,
  faCircleXmark,
  faPaperclip,
  faFile,
  faFilter,
  faTrashCan,
  faPenToSquare,
  faCalendarDays,
  faTag,
} from '@fortawesome/free-solid-svg-icons';
import './tasks.css';
export default function TasksPage() {
  const dispatch = useAppDispatch();
  const tasks = useSelector((s: RootState) => s.tasks.tasks);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectMode, setSelectMode] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>('');
  const [status, setStatus] = useState<'todo' | 'in-progress' | 'done' | ''>('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [algo, setAlgo] = useState<'merge' | 'quick'>('merge');
  const [time, setTime] = useState(0);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { shouldFade, scrolled, onMouseEnter, onMouseLeave } = useScrollFade(250, 1000);
  const isFormValid = title && description && priority && status && dueDate;
  const hasTasks = tasks.length > 0;
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await db.tasks.toArray();
      dispatch(setTasks(data));
      setLoading(false);
    };
    load();
  }, [dispatch]);
  const handleSave = () => {
    if (!title || !description || !priority || !status || !dueDate) return;
    const now = new Date().toISOString();
    const task: Task = {
      id: editingTask ? editingTask.id : uuid(),
      title,
      description,
      priority,
      status,
      dueDate: dueDate || now,
      createdAt: editingTask ? editingTask.createdAt : now,
      updatedAt: now,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      attachments: attachments,
    };
    if (editingTask) {
      dispatch(updateTaskThunk(task));
      setEditingTask(null);
    } else {
      dispatch(addTaskThunk(task));
    }
    setOpen(false);
    resetForm();
  };
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('');
    setStatus('');
    setTags('');
    setDueDate('');
    setAttachments([]);
  };
  const startEdit = (task: Task) => {
    setOpen(true);
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setStatus(task.status);
    setDueDate(task.dueDate.slice(0, 10));
    setTags(task.tags.join(', '));
    setAttachments(task.attachments);
  };
  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const statusMatch = filterStatus ? t.status === filterStatus : true;
      const priorityMatch = filterPriority ? t.priority === filterPriority : true;
      const tagMatch = filterTag ? t.tags.includes(filterTag) : true;
      return statusMatch && priorityMatch && tagMatch;
    });
  }, [tasks, filterStatus, filterPriority, filterTag]);
  const sortedTasks = useMemo(() => {
    const copy = [...filteredTasks];
    const start = performance.now();
    const result =
      algo === 'merge'
        ? mergeSortGeneric(
            copy,
            (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
          )
        : quickSortGeneric(
            copy,
            (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
          );
    const end = performance.now();
    setTime(end - start);
    return result;
  }, [filteredTasks, algo]);
  return (
    <div className="task-body">
      <div className="head">
        <h1>Task Management</h1>
        <button className="task-btn" onClick={() => setOpen(true)}>
          <FontAwesomeIcon className="i" icon={faPlus} />
          New Task
        </button>
      </div>
      {open && (
        <div className="f-con">
          <div className="form">
            <button
              className="cross"
              disabled={!!editingTask}
              onClick={() => {
                setEditingTask(null);
                resetForm();
                setOpen(false);
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h2 id={editingTask ? 'f-h' : ''}>{editingTask ? 'Edit Task' : 'Create Task'}</h2>
            <input
              className="title in"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="in"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label className="label">Due Date:</label>
            <input
              className="date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <select
              className="select s"
              value={priority}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setPriority(e.target.value as 'low' | 'medium' | 'high')
              }
            >
              <option value="" disabled>
                Select Priority
              </option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              className="select"
              value={status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setStatus(e.target.value as 'todo' | 'in-progress' | 'done')
              }
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <label className="label">(Optional):</label>
            <input
              className="tag"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <label className="label">(Optional):</label>
            <label id="att-lbl" htmlFor="uploadFile">
              <div className="f-btn">
                <FontAwesomeIcon icon={faPaperclip} className="i" />
                <span>Attach Files</span>
              </div>
              <input
                type="file"
                id="uploadFile"
                className="f-in"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files) return;
                  const names = Array.from(files).map((f) => f.name);
                  setAttachments((prev) => [...prev, ...names]);
                }}
              />
            </label>
            {attachments.length > 0 && (
              <div className="att-con">
                {attachments.map((name, i) => (
                  <div key={i} className="f-prev">
                    <button
                      className="x"
                      onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <FontAwesomeIcon icon={faFile} />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            )}
            {editingTask ? (
              <div>
                <button disabled={!isFormValid} className="btn up in" onClick={handleSave}>
                  <FontAwesomeIcon className="i" icon={faCircleCheck} />
                  Update
                </button>
                <button
                  className="btn in"
                  id="csl"
                  onClick={() => {
                    setEditingTask(null);
                    resetForm();
                  }}
                >
                  <FontAwesomeIcon className="i" icon={faCircleXmark} />
                  Cancel
                </button>
              </div>
            ) : (
              <button disabled={!isFormValid} className="add-btn in" onClick={handleSave}>
                <FontAwesomeIcon className="i" icon={faPlus} />
                Add
              </button>
            )}
          </div>
        </div>
      )}
      <div className={`filter-con ${shouldFade ? 'scrolled' : ''}`}>
        <div
          className={`filter-bar ${!hasTasks ? 'disabled' : ''}`}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="sel">
            <strong>
              <FontAwesomeIcon icon={faFilter} /> Filter:
            </strong>
            <input
              placeholder="Search Tags:"
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
            />
            <select
              className="filter-item"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Status</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select
              className="filter-item"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              className="filter-item"
              value={algo}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setAlgo(e.target.value as 'merge' | 'quick')
              }
            >
              <option value="merge">MergeSort</option>
              <option value="quick">QuickSort</option>
            </select>
            <span> Sort time: {time.toFixed(3)} ms</span>
          </div>
          {selectMode && (
            <div className="bulk">
              <button
                id="b-del"
                className="bulk-btn"
                disabled={selected.length === 0}
                onClick={() => {
                  setSelected([]);
                  setSelectMode(false);
                  selected.forEach((id) => dispatch(deleteTaskThunk(id)));
                }}
              >
                <FontAwesomeIcon className="b-i" icon={faTrashCan} />
                Bulk Delete
              </button>
              <button
                id="b-done"
                className="bulk-btn"
                disabled={selected.length === 0}
                onClick={() => {
                  selected.forEach((id) => {
                    const t = tasks.find((x) => x.id === id);
                    if (t)
                      dispatch(
                        updateTaskThunk({
                          ...t,
                          status: 'done',
                          updatedAt: new Date().toISOString(),
                        }),
                      );
                  });
                  setSelected([]);
                  setSelectMode(false);
                }}
              >
                <FontAwesomeIcon className="b-i" icon={faCircleCheck} />
                Mark Done
              </button>
            </div>
          )}
          <label className="slc-btn">
            <input
              type="checkbox"
              checked={selectMode}
              onChange={(e) => {
                setSelectMode(e.target.checked);
                setSelected([]);
              }}
            />
            Select Tasks
          </label>
        </div>
        {scrolled && (
          <button
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="task-btn"
            onClick={() => setOpen(true)}
          >
            <FontAwesomeIcon className="i" icon={faPlus} />
            New Task
          </button>
        )}
      </div>
      {!hasTasks && !loading ? (
        <div className="empty-msg">
          <h3>No tasks yet</h3>
          <p>Create your first task to get started</p>
          <button onClick={() => setOpen(true)}>
            <FontAwesomeIcon icon={faPlus} /> Create Task
          </button>
        </div>
      ) : (
        <div className="list-con">
          {loading && sortedTasks.length === 0 && (
            <div className="not-task">
              <h3>Loading...</h3>
            </div>
          )}
          {sortedTasks.length === 0 && !loading && (
            <div className="not-task">
              <span>Result not found!</span>
            </div>
          )}
          {sortedTasks.map((t) => (
            <div className="task" key={t.id}>
              {selectMode && (
                <input
                  type="checkbox"
                  checked={selected.includes(t.id)}
                  onChange={() => toggleSelect(t.id)}
                />
              )}
              <div>
                <div className="task-btns">
                  <button className="edit" onClick={() => startEdit(t)}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button className="del" onClick={() => dispatch(deleteTaskThunk(t.id))}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
                <h2> {t.title}</h2>
                <p> {t.description}</p>
                <div className="meta-data">
                  <span className="p-spn">
                    Priority:
                    <FontAwesomeIcon
                      icon={priorityConfig[t.priority].icon}
                      className={priorityConfig[t.priority].class}
                    />
                    {t.priority} |
                  </span>
                  <span>
                    Status:
                    <FontAwesomeIcon
                      icon={statusConfig[t.status].icon}
                      className={statusConfig[t.status].class}
                    />
                    {t.status} |
                  </span>
                  {t.tags.length > 0 && (
                    <span>
                      <FontAwesomeIcon className="tag-i" icon={faTag} />
                      Tags: {t.tags.join(', ')} |
                    </span>
                  )}
                  <span>
                    <FontAwesomeIcon className="date-i" icon={faCalendarDays} />
                    Due Date: {new Date(t.dueDate).toLocaleDateString()}
                  </span>
                </div>
                {t.attachments.length > 0 && (
                  <div className="task-att">
                    <span>
                      <FontAwesomeIcon className="pin" icon={faPaperclip} />
                      Attachments:
                    </span>
                    {t.attachments.map((name, index) => (
                      <div className="att" key={index}>
                        <FontAwesomeIcon className="att-i" icon={faFile} />
                        <span>{name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
