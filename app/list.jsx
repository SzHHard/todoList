

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
                <input onChange={this.onCheck} checked={this.props.completed} type="checkbox" />
                <input onChange={this.onChange} type="text" value={this.props.text} />
                <button onClick={this.onDelete} className="task-delete">⨯</button>
            </li>
        )
    }
}
export class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = { tasks: [] };
        this.handleEnter = this.handleEnter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
    }

    handleEnter(event) {
        if (event.key === 'Enter') {
            let newval = {text: event.target.value, completed: false}  
            this.setState({
                tasks: [
                    ...this.state.tasks,
                    newval
                ]
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

    render() {

        return (
            <div id="todo-list">
                <input onKeyPress={this.handleEnter} type="text" className="label" id="input-list" placeholder="What needs to be done?" />
                <ul>
                    {this.state.tasks.map(({text, completed}, index) => <Task handleCheck={this.handleCheck} handleDelete={this.handleDelete} key={index} id={index} completed={completed} text={text} handleChange={this.handleChange} />)}
                </ul>
            </div>
        );
    }
}