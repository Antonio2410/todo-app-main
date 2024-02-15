import React, { useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Todo from './Todo';
import TodoForm from './TodoForm';
import TodoFilter from './TodoFilter';
import moonIcon from '../images/icon-moon.svg';
import sunIcon from '../images/icon-sun.svg';
import '../styles/TodoList.css';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('all');
    const [darkMode, setDarkMode] = useState(false);

    const addTodo = (text) => {
        setTodos((prevTodos) => [
            ...prevTodos,
            { id: Date.now(), text, completed: false },
        ]);
    };

    const toggleComplete = (id) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteTodo = (id) => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    };

    const moveTodo = (dragIndex, hoverIndex) => {
        const dragTodo = todos[dragIndex];
        setTodos((prevTodos) => {
            const updatedTodos = [...prevTodos];
            updatedTodos.splice(dragIndex, 1);
            updatedTodos.splice(hoverIndex, 0, dragTodo);
            return updatedTodos;
        });
    };

    const clearCompleted = () => {
        setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
    };

    const filteredTodos = todos.filter((todo) => {
        if (filter === 'all') return true;
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const toggleDarkMode = () => {
        setDarkMode((prevDarkMode) => !prevDarkMode);
    };

    return (
        <div className={`todo-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="title-container">
                <h1>Todo</h1>
                <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                    <img src={darkMode ? sunIcon : moonIcon} alt="Dark Mode Toggle" />
                </button>
            </div>
            <TodoForm addTodo={addTodo} />
            <DndProvider backend={HTML5Backend}>
                {filteredTodos.map((todo, index) => (
                    <div key={todo.id}>
                        <TodoWithDragAndDrop
                            index={index}
                            todo={todo}
                            toggleComplete={toggleComplete}
                            deleteTodo={deleteTodo}
                            moveTodo={moveTodo}
                        />
                    </div>
                ))}
            </DndProvider>
            <TodoFilter todos={todos} setFilter={setFilter} clearCompleted={clearCompleted} />
        </div>
    );
};

const TodoWithDragAndDrop = ({ index, todo, toggleComplete, deleteTodo, moveTodo }) => {
    const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: 'TODO',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'TODO',
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            moveTodo(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    useEffect(() => {
        const currentRef = ref.current;
        if (currentRef) {
            currentRef.addEventListener('pointerdown', handlePointerDown);
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('pointerdown', handlePointerDown);
            }
        };
    }, []);

    const handlePointerDown = (event) => {
        if (ref.current) {
            ref.current.setPointerCapture(event.pointerId);
        }
    };

    drag(drop(ref));

    return (
        <div
            ref={ref}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
            }}
        >
            <Todo
                todo={todo}
                toggleComplete={toggleComplete}
                deleteTodo={deleteTodo}
            />
        </div>
    );
};

export default TodoList;
