import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './comicsList.scss';

const ComicsList = () => {
    const [comicList, setComicList] = useState([])
    const [offset, setOffset] = useState(0)
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [comicsEnded, setComicsEnded] = useState(false)

    const {error, loading, getAllComics} = useMarvelService()

    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicList) => {
        let ended = false
        if (newComicList.length < 8) {
            ended = true
        }

        setComicList([...comicList, ...newComicList])
        setNewItemLoading(false)
        setOffset(offset + 8)
        setComicsEnded(ended)
    }

    function renderItems(arr) {
        const items =  arr.map((item, i) => {            
            return (
                <li className="comics__item"
                    key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const errorMessage = error ? <ErrorMessage/> : null
    const spinner = loading && !newItemLoading ? <Spinner/> : null

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {renderItems(comicList)}
            <button 
                onClick={() => onRequest(offset)}
                disabled={newItemLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;