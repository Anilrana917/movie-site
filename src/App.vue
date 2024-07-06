<template>
  <div id="app">
    <header class="app-header">
      <h1>MoviesFlexx</h1>
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search for movies..."
          @input="handleSearch"
          class="search-bar"
        />
        <svg
          id="tnb-google-search-icon"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
        >
          <path
            d="M11.8153 10.3439C12.6061 9.2673 13.0732 7.9382 13.0732 6.5C13.0732 2.91015 10.163 0 6.57318 0C2.98333 0 0.0731812 2.91015 0.0731812 6.5C0.0731812 10.0899 2.98333 13 6.57318 13C8.01176 13 9.3412 12.5327 10.4179 11.7415L10.4171 11.7422C10.4466 11.7822 10.4794 11.8204 10.5156 11.8566L14.3661 15.7071C14.7566 16.0976 15.3898 16.0976 15.7803 15.7071C16.1708 15.3166 16.1708 14.6834 15.7803 14.2929L11.9298 10.4424C11.8936 10.4062 11.8553 10.3734 11.8153 10.3439ZM12.0732 6.5C12.0732 9.53757 9.61075 12 6.57318 12C3.53561 12 1.07318 9.53757 1.07318 6.5C1.07318 3.46243 3.53561 1 6.57318 1C9.61075 1 12.0732 3.46243 12.0732 6.5Z"
            fill="black"
          ></path>
        </svg>
      </div>
      <GenreFilter :genres="genres" @change="handleGenreFilter" />
      <div class="year-header">
        <h2>
          Showing movies from {{ prevYear + 1 }}
          <span v-if="nextYear - 1 > 2012">to {{ nextYear - 1 }}</span>
        </h2>
      </div>
    </header>
    <div class="movie-list">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        :genres="genres"
      />
    </div>
  </div>
</template>

<script>
import MovieCard from "./components/MovieCard.vue";
import GenreFilter from "./components/GenreFilter.vue";
import { fetchMoviesByYear, fetchGenres, searchMovies } from "./api";

export default {
  components: {
    MovieCard,
    GenreFilter,
  },
  data() {
    return {
      movies: [],
      genres: [],
      currentYear: 2012,
      nextYear: 2013,
      prevYear: 2011,
      currentPage: 1,
      selectedGenres: [],
      searchQuery: "",
      loading: false,
    };
  },
  async created() {
    await this.loadMovies(this.currentYear, this.currentPage);
    const genreResponse = await fetchGenres();
    this.genres = genreResponse.data.genres;
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    async loadMovies(year, page = 1) {
      if (this.loading) return;
      this.loading = true;
      const response = await fetchMoviesByYear(year, page, this.selectedGenres);
      this.movies = [...this.movies, ...response.data.results];
      this.loading = false;
    },
    async handleGenreFilter(genreId, isSelected) {
      if (isSelected) {
        this.selectedGenres.push(genreId);
      } else {
        this.selectedGenres = this.selectedGenres.filter(
          (id) => id !== genreId
        );
      }
      this.movies = [];
      this.currentYear = 2012;
      this.nextYear = 2013;
      this.prevYear = 2011;
      this.currentPage = 1;
      await this.loadMovies(this.currentYear, this.currentPage);
    },
    async handleSearch() {
      this.movies = [];
      this.currentPage = 1;
      if (this.searchQuery.trim()) {
        await this.searchMovies(this.searchQuery, this.currentPage);
      } else {
        await this.loadMovies(this.currentYear, this.currentPage);
      }
    },
    async searchMovies(query, page = 1) {
      if (this.loading) return;
      this.loading = true;
      const response = await searchMovies(query, page);
      this.movies = [...this.movies, ...response.data.results];
      this.loading = false;
    },
    async handleScroll() {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 10 && !this.loading) {
        if (this.searchQuery.trim()) {
          await this.searchMovies(this.searchQuery, ++this.currentPage);
        } else {
          await this.loadMovies(this.nextYear, 1);
          this.nextYear++;
        }
      }

      if (scrollTop === 0 && !this.loading && !this.searchQuery.trim()) {
        const movies = await fetchMoviesByYear(
          this.prevYear,
          1,
          this.selectedGenres
        );
        this.movies = [...movies.data.results, ...this.movies];
        this.prevYear--;
      }
    },
  },
};
</script>

<style>
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: red;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b30000;
}

.search-box {
  position: absolute;
  top: 12px;
  right: 40px;
}
.search-box svg {
  position: relative;
  top: 5px;
  right: 30px;
}
body {
  background: black;
  color: #fff;
  font-family: sans-serif;
}
.app-header {
  position: relative;
  padding: 0.1rem 1.7rem;
  background-color: #3a3535;
  margin: 2rem 1rem;
}
.app-header h1 {
  color: red;
  font-family: sans-serif;
}
.movie-list {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 2rem;
}
.year-header h1 {
  font-weight: 200;
}
.year-header {
  position: sticky;
  top: 0;
  color: white;
  z-index: 10;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
.search-bar {
  border-radius: 14px;
  margin: 1rem 0rem;
  padding: 0.4rem 5rem 0.4rem 1rem;
  border: unset;
}
.search-bar input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
}
@media (max-width: 768px) {
  .movie-list {
    height: auto;
  }
  .search-box {
    position: unset;
  }
  .app-header {
    padding: 0.1rem 1rem;
    background-color: #3a3535;
    margin: 1rem 0.5rem;
    padding-right: 0;
  }
  body {
    font-size: 14px;
  }
  .year-header {
    border-bottom: unset;
    padding: 0;
  }
}
</style>
