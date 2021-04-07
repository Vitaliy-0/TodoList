import React, { Component } from 'react';
import AppHeader from '../appHeader';
import SearchPanel from '../searchPanel';
import PostStatusFilter from '../postStatusFilter';
import PostList from '../postList';
import PostAddForm from '../postAddForm';

import './app.css';
import styled from 'styled-components';
// import style from './app.module.css';

const AppBlock = styled.div`
    margin: 0 auto;
    max-width: 800px;
`


export default class App extends Component {
    state = {
        data: [
            {label: 'Going to learn React', important: false, like: false, id: 1},
            {label: 'That is so good', important: false, like: false, id: 2},
            {label: 'I need a break...', important: false, like: false, id: 3},
        ],
        term: '',
        filter: 'all'
    }
    maxId = 4;
    
    deleteItem = (id) => {
        this.setState(({data}) => {
            const index = data.findIndex(elem => elem.id === id);

            const newArr = [...data.slice(0, index), ...data.slice(index + 1)];

            return {
                data: newArr
            }
        });
    }

    addItem = (body) => {
        const newItem = {
            label: body,
            important: false,
            id: this.maxId++,
        }
        this.setState(({data}) => {
            const newArr = [...data, newItem];
            return {
                data: newArr
            }
        })
    }

    changeStateItem = (id, item) => {
        this.setState(({data}) => {
            const index = data.findIndex(elem => elem.id === id);

            const old = data[index];
            const newItem = {...old, [item]: !old[item]};

            const newArr = [...data.slice(0, index), newItem , ...data.slice(index + 1)];

            return {
                data: newArr
            }
        })
    }

    onToggleImportant = (id) => {
        this.changeStateItem(id, 'important');
    }

    onToggleLiked = (id) => {
        this.changeStateItem(id, 'like');
    }

    searchPost = (items, term) => {
        if (term.length === 0){
            return items;
        }

        return items.filter( (item) => {
            return item.label.indexOf(term) > -1
        });
    }

    filterPost = (items, filter) => {
        if (filter === 'like') {
            return items.filter(item => item.like)
        } else if(filter === 'important'){    
            return items.filter(item => item.important)
        } else{
            return items
        }
    }

    onUpdateSearch = (term) => {
        this.setState({term})
    }

    onFilterSelect = (filter) => {
        this.setState({filter})
    }

    render() {
        const {data, term, filter} = this.state;

        const liked = data.filter(item => item.like).length;
        const importanted = data.filter(item => item.important).length;
        const allPosts = data.length;

        const visiblePosts = this.filterPost(this.searchPost(data, term), filter);

        return (
            <AppBlock>
                <AppHeader
                liked={liked}
                importanted={importanted}
                allPosts={allPosts}/>
                <div className="search-panel d-flex">
                    <SearchPanel 
                        onUpdateSearch={this.onUpdateSearch}/>
                    <PostStatusFilter
                        filter={filter}
                        onFilterSelect={this.onFilterSelect}/>
                </div>
                <PostList 
                    posts={ visiblePosts }
                    onDelete={ this.deleteItem }
                    onToggleImportant={this.onToggleImportant}
                    onToggleLiked={this.onToggleLiked}/>
                <PostAddForm
                    onAdd={this.addItem}
                />
            </AppBlock> 
        )
    }
}
