import React from 'react';
import '../styles/TodoFilter.css';

const TodoFilter = ({ todos, setFilter, clearCompleted }) => {
    const remainingItems = todos.filter(todo => !todo.completed).length;

    return (
        <div className="filter-container" style={{ border: '1px solid #ccc', padding: '10px', width: '350px', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 'auto' }}>{remainingItems} {remainingItems === 1 ? 'item' : 'items'} left</span>
            <div className="filter-buttons" style={{ margin: '0 auto' }}>
                <button onClick={() => setFilter('all')}>All</button>
                <button onClick={() => setFilter('active')}>Active</button>
                <button onClick={() => setFilter('completed')}>Completed</button>
            </div>
            {todos.some(todo => todo.completed) && <button onClick={clearCompleted}>Clear completed</button>}
        </div>
    );
};

export default TodoFilter;
