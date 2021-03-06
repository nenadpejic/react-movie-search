import "./style.css";
import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { Search, Main } from "../../components";
import { reducer, initialState } from "../../reducer";
import { apiUrl, apiKey } from "../../config/API";

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
    let API = apiUrl;
    if (!searchYear && !searchType) {
      API += `?s=${searchTitle}`;
    } else if (searchYear && !searchType) {
      API += `?s=${searchTitle}&y=${searchYear}`;
    } else if (!searchYear && searchType) {
      API += `?s=${searchTitle}&type=${searchType}`;
    } else if (searchYear && searchType) {
      API += `?s=${searchTitle}&y=${searchYear}&type=${searchType}`;
    }
    API += `&apikey=${apiKey}`;

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
      <Main state={state} dispatch={dispatch} handleSearch={handleSearch} />
    </div>
  );
}

export default Home;
