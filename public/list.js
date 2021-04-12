var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export var Task = function (_React$Component) {
    _inherits(Task, _React$Component);

    function Task(props) {
        _classCallCheck(this, Task);

        var _this = _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).call(this, props));

        _this.state = { text: '' };

        _this.onDelete = _this.onDelete.bind(_this);
        _this.onChange = _this.onChange.bind(_this);
        _this.onCheck = _this.onCheck.bind(_this);
        return _this;
    }

    _createClass(Task, [{
        key: "onChange",
        value: function onChange(e) {
            this.props.handleChange(this.props.id, e);
        }
    }, {
        key: "onDelete",
        value: function onDelete() {
            this.props.handleDelete(this.props.id);
        }
    }, {
        key: "onCheck",
        value: function onCheck() {
            this.props.handleCheck(this.props.id);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "li",
                { className: "task" },
                React.createElement("input", { onChange: this.onCheck, checked: this.props.completed, type: "checkbox" }),
                React.createElement("input", { onChange: this.onChange, type: "text", value: this.props.text }),
                React.createElement(
                    "button",
                    { onClick: this.onDelete, className: "task-delete" },
                    "\u2A2F"
                )
            );
        }
    }]);

    return Task;
}(React.Component);
export var List = function (_React$Component2) {
    _inherits(List, _React$Component2);

    function List(props) {
        _classCallCheck(this, List);

        var _this2 = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

        _this2.state = { tasks: [] };
        _this2.handleEnter = _this2.handleEnter.bind(_this2);
        _this2.handleChange = _this2.handleChange.bind(_this2);
        _this2.handleDelete = _this2.handleDelete.bind(_this2);
        _this2.handleCheck = _this2.handleCheck.bind(_this2);
        return _this2;
    }

    _createClass(List, [{
        key: "handleEnter",
        value: function handleEnter(event) {
            if (event.key === 'Enter') {
                var newval = { text: event.target.value, completed: false };
                this.setState({
                    tasks: [].concat(_toConsumableArray(this.state.tasks), [newval])
                });

                event.target.value = '';
            }
        }
    }, {
        key: "handleDelete",
        value: function handleDelete(key) {
            var new_tasks = [].concat(_toConsumableArray(this.state.tasks));
            new_tasks.splice(key, 1);
            this.setState({
                tasks: new_tasks
            });
        }
    }, {
        key: "handleChange",
        value: function handleChange(key, e) {
            var new_tasks = [].concat(_toConsumableArray(this.state.tasks));
            new_tasks[key].text = e.target.value;
            this.setState({
                tasks: new_tasks
            });
        }
    }, {
        key: "handleCheck",
        value: function handleCheck(key) {
            var new_tasks = [].concat(_toConsumableArray(this.state.tasks));
            new_tasks[key].completed = !new_tasks[key].completed;
            this.setState({
                tasks: new_tasks
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return React.createElement(
                "div",
                { id: "todo-list" },
                React.createElement("input", { onKeyPress: this.handleEnter, type: "text", className: "label", id: "input-list", placeholder: "What needs to be done?" }),
                React.createElement(
                    "ul",
                    null,
                    this.state.tasks.map(function (_ref, index) {
                        var text = _ref.text,
                            completed = _ref.completed;
                        return React.createElement(Task, { handleCheck: _this3.handleCheck, handleDelete: _this3.handleDelete, key: index, id: index, completed: completed, text: text, handleChange: _this3.handleChange });
                    })
                )
            );
        }
    }]);

    return List;
}(React.Component);