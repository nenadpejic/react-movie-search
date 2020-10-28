import React, { useEffect, useReducer } from "react";
import "./style.css";
import axios from "axios";
import Search from "../components/Search";
import Movies from "../components/Movies";
import { reducer, initialState } from "../reducer";

function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (localStorage.getItem("movies")) {
      dispatch({
        type: "SEARCH_SUCCESS",
        payload: { movies: JSON.parse(localStorage.getItem("movies")) },
      });
    }
  }, []);

  const handleSearch = (searchTitle, searchYear = "", searchType = "") => {
    const apiKey = "3c0a7396";
    let API = "";

    if (!searchYear && !searchType) {
      API = `https://www.omdbapi.com/?s=${searchTitle}&apikey=${apiKey}`;
    } else if (searchYear && !searchType) {
      API = `https://www.omdbapi.com/?s=${searchTitle}&y=${searchYear}&apikey=${apiKey}`;
    } else if (!searchYear && searchType) {
      API = `https://www.omdbapi.com/?s=${searchTitle}&type=${searchType}&apikey=${apiKey}`;
    } else if (searchYear && searchType) {
      API = `https://www.omdbapi.com/?s=${searchTitle}&y=${searchYear}&type=${searchType}&apikey=${apiKey}`;
    }

    dispatch({ type: "SEARCH_LOADING" });

    axios
      .get(API)
      .then((res) => {
        if (res.data.Response === "True") {
          dispatch({
            type: "SEARCH_SUCCESS",
            payload: { movies: res.data.Search },
          });
          localStorage.setItem("movies", JSON.stringify(res.data.Search));
        } else {
          // results
          console.log(res.data.Error);
          dispatch({
            type: "SEARCH_ERR",
            payload: { errMsg: res.data.Error },
          });
        }
      })
      .catch((err) => {
        // url
        console.log(err);
        dispatch({
          type: "SEARCH_ERR",
          payload: { errMsg: "Network error!" },
        });
        if (err.response && err.response.status === 401) {
          // api
          console.log(err.response.data.Error);
          dispatch({
            type: "SEARCH_ERR",
            payload: { errMsg: err.response.data.Error },
          });
        }
      });
  };

  return (
    <div className="Home">
      <Search dispatch={dispatch} handleSearch={handleSearch} />
      <Movies state={state} dispatch={dispatch} handleSearch={handleSearch} />
    </div>
  );
}

export default Home;
