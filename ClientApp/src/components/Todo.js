import React, { Component } from 'react';
import { TodoRepository } from '../todorepo';
import { OfflineRepository } from '../offlinerepo';

export class Todo extends Component {
    displayName = Todo.name

    constructor(props) {
        super(props);

        this._offlineRepository = new OfflineRepository();
        this._todoRepository = new TodoRepository(this._offlineRepository);

        this.state = { items: [], loading: true, newItem: '' };

        this._todoRepository.LoadItems(data => {
            this.setState({ items: data, loading: false, newItem: '' });
        });

        this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);

        this.checkOnlineState();
    }

    checkOnlineState = () => {        
        this._offlineRepository.CheckState(state => {
            console.log(state);
            this.setState({ online: state });
        });

        window.setTimeout(() => {
            this.checkOnlineState();
        }, 5000);
    };

    createCheckBox = (item) => (
        <li key={"li_" + item.id}>
            <label>
                <input key={"cb_" + item.id} 
                    type="checkbox" 
                    defaultChecked={item.isDone} 
                    onChange={(event) => this.handleCheckBoxChange(event, item.id, item.name)} />&nbsp;
                <span>{item.name}</span>                
            </label>
        </li>
    );

    handleCheckBoxChange = (event, id, name) => {
        let isDone = event.target.checked;
        console.info(name + " {" + id + "} {" + isDone + "}");
        this._todoRepository.UpdateItem({
            id: id,
            name: name,
            isDone: isDone
        },() =>{
            this._todoRepository.LoadItems(data => {
                this.setState({ items: data });
            });
        })
    }

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
            <input type="text" value={ this.state.newItem } onChange={this.handleAddChange} />
            <input type="button" value="Add" onClick={this.handleAddClick} />
        </p>
    );

    handleAddChange = (event) => {
        this.setState({ newItem: event.target.value });
    };

    handleAddClick = (event) => {
        var name = this.state.newItem;
        this._todoRepository.CreateItem({
            id: -1,
            name: name,
            isDone: false
        }, () => {
            this._todoRepository.LoadItems(data => {
                this.setState({ items: data });
            });
        });
    };

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderTodoItems(this.state.items);

        let online = this.state.online
            ? <span className="label label-success">ONLINE</span>
            : <span className="label label-danger">OFFLINE</span>;

        return (
            <div>
                <h1>TODO List</h1>
                <h2>{ online }</h2>
                <p>This component demonstrates fetching data from the server.</p>
                { this.newItemForm() }
                { contents }
            </div>
        );
    }
}