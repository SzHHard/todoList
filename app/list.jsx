
import React from 'react'
import ReactDOM from 'react-dom'

export class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: '' }

        this.onDelete = this.onDelete.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onCheck = this.onCheck.bind(this)
    }

    onChange(e) {
        this.props.handleChange(this.props.id, e)
    }

    onDelete() {
        this.props.handleDelete(this.props.id)
    }
    onCheck() {
        this.props.handleCheck(this.props.id)
    }

    render() {
        return (
            <li className="task">
                <input onChange={this.onCheck} checked={this.props.completed} type="checkbox" className='checkbx' />
                <input className='inner-input' onChange={this.onChange} type="text" value={this.props.text} />
                <button onClick={this.onDelete} className="del-but"></button>
            </li>
        )
    }
}

const server = 'http://localhost:3000/api';
const urlForGetAllRequest = server + '/tasks';
const FILTER = { ALL: 'All', ACTIVE: 'Active', COMPLETED: 'Completed' }

export class List extends React.Component {


    constructor(props) {
        super(props);
        this.state = { tasks: [], filter: FILTER.ALL };
        this.handleEnter = this.handleEnter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleClearCompleted = this.handleClearCompleted.bind(this);
    }


    componentDidMount() {
        fetch(urlForGetAllRequest).then(res => {
            if (!res.ok) throw "Server Not Available"
            return res.json()
        }).then(tasks => {
            return tasks.map(task => { return { text: task.content, completed: task.active == 0, id: task.id } })
        }).then(tasks => {
            this.setState({ tasks: tasks })
        })
    }

    handleEnter(event) {
        if (event.key === 'Enter') {
            let text = event.target.value;

            fetch(urlForGetAllRequest, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text })
            }).then(res => {
                return res.json()
            }).then(res => {
                let newval = { text: text, completed: false, id: res.id }
                this.setState({
                    tasks: [
                        ...this.state.tasks,
                        newval
                    ]
                })
            })

            event.target.value = '';
        }
    }
    handleDelete(key) {
        const dbId = this.state.tasks[key].id;
        fetch(urlForGetAllRequest + '/' + dbId, {
            method: 'DELETE'
        })
        const new_tasks = [...this.state.tasks]
        new_tasks.splice(key, 1);
        this.setState({
            tasks: new_tasks
        })
    }

    handleChange(key, e) {
        const dbId = this.state.tasks[key].id;
        fetch(urlForGetAllRequest + '/' + dbId + '?content=' + e.target.value, {
            method: 'PUT'
        })
        const new_tasks = [...this.state.tasks]
        new_tasks[key].text = e.target.value
        this.setState({
            tasks: new_tasks
        })
    }

    handleCheck(key) {
        const new_tasks = [...this.state.tasks]
        new_tasks[key].completed = !new_tasks[key].completed
        console.log(new_tasks[key])
        this.setState({
            tasks: new_tasks
        })
        const dbId = new_tasks[key].id; // почему undefined без обновления страницы?
        fetch(urlForGetAllRequest + '/' + dbId + '?active=' + !new_tasks[key].completed, {
            method: 'PUT'
        })
    }

    handleFilter(type) {
        this.setState({ filter: type });
    }

    handleClearCompleted() {
        let tasks = this.state.tasks.filter((task) => { return !task.completed })
        this.setState({ tasks: tasks })

    }

    render() {
        let currentTasks = this.state.tasks.map((task, index) => ({ task, index })).filter(({ task }) => {
            switch (this.state.filter) {
                case FILTER.ACTIVE: return !task.completed;
                case FILTER.COMPLETED: return task.completed;
                default: return true;
            }
        })

        let tasksLeft = this.state.tasks.filter((task) => !task.completed).length;
        return (
            <div className='bigbox' id="todo-list">
                <ul>
                    <li>
                        <input onKeyPress={this.handleEnter} type="text" className="label" id="input-list" placeholder="What needs to be done?" />
                    </li>
                    {currentTasks.map(({ task: { text, completed }, index }) => <Task handleCheck={this.handleCheck} handleDelete={this.handleDelete} key={index} id={index} completed={completed} text={text} handleChange={this.handleChange} />)}
                </ul>
                <div className="table-footer">
                    <p style={{ display: 'inline', marginRight: 25 }}>{tasksLeft} items left</p>
                    <button className={this.state.filter === FILTER.ALL ? 'btnclicked' : null} onClick={() => this.handleFilter(FILTER.ALL)}>All</button>
                    <button className={this.state.filter === FILTER.ACTIVE ? 'btnclicked' : null} onClick={() => this.handleFilter(FILTER.ACTIVE)}>Active</button>
                    <button className={this.state.filter === FILTER.COMPLETED ? 'btnclicked' : null} onClick={() => this.handleFilter(FILTER.COMPLETED)}>Completed</button>

                    <button className='clear-compl' onClick={this.handleClearCompleted}>Clear Completed</button>
                </div>
            </div>
        );
    }
}