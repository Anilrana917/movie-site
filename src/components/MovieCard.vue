<template>
  <div class="movie-card">
    <div class="text-content">
      <img
        :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`"
        alt="movie poster"
      />
      <h3>{{ movie.title }}</h3>
      <p>{{ movie.overview }}</p>
      <div class="genre-content">
        <strong>Genres:</strong>
        <span v-for="genre in movie.genre_ids" :key="genre">{{
          getGenreName(genre)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    movie: Object,
    genres: Array,
  },
  methods: {
    getGenreName(genreId) {
      const genre = this.genres.find((genre) => genre.id === genreId);
      return genre ? genre.name : "";
    },
  },
};
</script>

<style scoped>
.text-content {
  width: 100%;
}
.text-content p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 4.5em;
  line-height: 1.5em;
}
.genre-content {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}
.movie-card {
  width: 22%;
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  align-items: start;
  margin-bottom: 2.5rem;
}
.text-content img {
  width: 300px;
}

@media (max-width: 768px) {
  .movie-card {
    width: 45%;
  }
  .text-content img {
    width: 100%;
  }
}
</style>
