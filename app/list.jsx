

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
                <input onChange={this.onChange} type="text" value={this.props.text} />
                <button onClick={this.onDelete} className="del-but"></button>
            </li>
        )
    }
}

const server = 'http://localhost:3000/api';
const urlForGetAllRequest = server + '/tasks';

export class List extends React.Component {

    static FILTER = { ALL: 'All', ACTIVE: 'Active', COMPLETED: 'Completed' }

    constructor(props) {
        super(props);
        this.state = { tasks: [], filter: List.FILTER.ALL };
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
        const new_tasks = [...this.state.tasks]
        new_tasks.splice(key, 1);
        this.setState({
            tasks: new_tasks
        })
    }

    handleChange(key, e) {
        const new_tasks = [...this.state.tasks]
        new_tasks[key].text = e.target.value
        this.setState({
            tasks: new_tasks
        })
    }

    handleCheck(key) {
        const new_tasks = [...this.state.tasks]
        new_tasks[key].completed = !new_tasks[key].completed
        this.setState({
            tasks: new_tasks
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
                case List.FILTER.ACTIVE: return !task.completed;
                case List.FILTER.COMPLETED: return task.completed;
                default: return true;
            }
        })

        let tasksLeft = this.state.tasks.filter((task) => !task.completed).length;
        return (
            <div className='bigbox' id="todo-list">
                <input onKeyPress={this.handleEnter} type="text" className="label" id="input-list" placeholder="What needs to be done?" />
                <ul>
                    {currentTasks.map(({ task: { text, completed }, index }) => <Task handleCheck={this.handleCheck} handleDelete={this.handleDelete} key={index} id={index} completed={completed} text={text} handleChange={this.handleChange} />)}
                </ul>
                <div className="table-footer">
                    <p style={{ display: 'inline' }}>{tasksLeft} items left</p>
                    <button className={this.state.filter === List.FILTER.ALL ? 'btnclicked' : null} onClick={() => this.handleFilter(List.FILTER.ALL)}>All</button>
                    <button className={this.state.filter === List.FILTER.ACTIVE ? 'btnclicked' : null} onClick={() => this.handleFilter(List.FILTER.ACTIVE)}>Active</button>
                    <button className={this.state.filter === List.FILTER.COMPLETED ? 'btnclicked' : null} onClick={() => this.handleFilter(List.FILTER.COMPLETED)}>Completed</button>

                    <button className='clear-compl' onClick={this.handleClearCompleted}>Clear Completed</button>
                </div>
            </div>
        );
    }
}