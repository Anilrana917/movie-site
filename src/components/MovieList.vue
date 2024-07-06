<template>
  <div>
    <div v-for="movie in movies" :key="movie.id" class="movie-card">
      <h2>{{ movie.title }}</h2>
      <img
        :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
        alt="Movie Poster"
      />
      <p>{{ movie.overview }}</p>
      <p>
        <strong>Genres:</strong> {{ getGenres(movie.genre_ids).join(", ") }}
      </p>
      <p><strong>Director:</strong> {{ getDirector(movie.id) }}</p>
      <p><strong>Cast:</strong> {{ getCast(movie.id).join(", ") }}</p>
    </div>
    <div v-if="loading">Loading...</div>
  </div>
</template>

<script>
import { fetchMoviesByYear } from "./services/apiService.js";

export default {
  props: {
    year: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      movies: [],
      page: 1,
      loading: false,
    };
  },
  async mounted() {
    await this.loadMovies();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    filterMoviesByGenre(genreId) {
      this.movies = [];
      this.page = 1;
      this.loadMoviesByGenre(genreId);
    },
    async loadMoviesByGenre(genreId) {
      this.loading = true;
      const response = await fetchMoviesByYear(this.year, this.page);
      const filteredMovies = response.results.filter((movie) => {
        return genreId === "" || movie.genre_ids.includes(genreId);
      });
      this.movies.push(...filteredMovies);
      this.page++;
      this.loading = false;
    },
    async loadMovies() {
      this.loading = true;
      const response = await fetchMoviesByYear(this.year, this.page);
      this.movies.push(...response.results);
      this.page++;
      this.loading = false;
    },
    handleScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        this.loadMovies();
      }
    },
    getGenres(genreIds) {
      return genreIds.map((id) => this.genreMap[id]);
    },
    async getDirector(movieId) {
      return "Director Name";
    },
    async getCast(movieId) {
      return ["Actor 1", "Actor 2"];
    },
  },
};
</script>

<style>
.movie-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
.movie-card img {
  max-width: 100%;
}
</style>
