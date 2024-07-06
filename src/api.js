import axios from "axios";

const apiKey = "2dca580c2a14b55200e784d157207b4d";
const baseURL = "https://api.themoviedb.org/3";

export const fetchMoviesByYear = (year, page = 1, genres = []) => {
  const genreString = genres.length ? genres.join(",") : "";
  const url = `${baseURL}/discover/movie`;
  const params = {
    api_key: apiKey,
    sort_by: "popularity.desc",
    primary_release_year: year,
    page: page,
    vote_count: { gte: 100 },
    with_genres: genreString,
  };

  return axios.get(url, { params });
};

export const fetchGenres = () => {
  return axios.get(`${baseURL}/genre/movie/list`, {
    params: {
      api_key: apiKey,
    },
  });
};

export const searchMovies = (query, page = 1) => {
  const url = `${baseURL}/search/movie`;
  const params = {
    api_key: apiKey,
    query: query,
    page: page,
  };

  return axios.get(url, { params });
};
