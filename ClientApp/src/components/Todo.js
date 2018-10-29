import React, { Component } from 'react';
import { TodoRepository } from '../todorepo';

export class Todo extends Component {
    displayName = Todo.name

    constructor(props) {
        super(props);

        this.state = { items: [], loading: true, newItem: '' };

        TodoRepository.LoadItems((data) => {
            this.setState({ items: data, loading: false, newItem: '' });
        });

        this.handleChange = this.handleChange.bind(this);
    }

    createCheckBox = (item) => (
        <li key={"li_" + item.id}>
            <label>
                <input key={"cb_" + item.id} 
                    type="checkbox" 
                    defaultChecked={item.isDone} 
                    onChange={this.handleChange} />&nbsp;
                <span>{item.name}</span>
            </label>
        </li>
    );

    createCheckBoxes = (items) => (
        items.map(item =>
            this.createCheckBox(item)
        )
    );

    renderTodoItems = (items) => (
        <ul>
            {this.createCheckBoxes(items)}
        </ul>
    )

    newItemForm = () => (
        <p>
            <input type="text" value={ this.state.newItem } />
            <input type="button" value="Add" />
        </p>
    );

    handleChange = (event) => {
        let checked = !event.target.checked;
        let id = event.target.id;
        console.info("{" + id + "} {" + checked + "}");
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderTodoItems(this.state.items);

        return (
            <div>
                <h1>TODO List</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {this.newItemForm()}
                {contents}
            </div>
        );
    }
}