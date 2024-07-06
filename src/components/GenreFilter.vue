<template>
  <div class="genre-filter">
    <label v-for="genre in genres" :key="genre.id">
      <input type="checkbox" :value="genre.id" @change="handleGenreChange" />
      <span :class="{ active: selectedGenres.includes(genre.id) }">
        {{ genre.name }}
      </span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    genres: Array,
  },
  data() {
    return {
      selectedGenres: [],
    };
  },
  methods: {
    handleGenreChange(event) {
      const genreId = parseInt(event.target.value, 10);
      const isSelected = event.target.checked;
      if (isSelected) {
        this.selectedGenres.push(genreId);
      } else {
        this.selectedGenres = this.selectedGenres.filter(
          (id) => id !== genreId
        );
      }
      console.log("event.targ", isSelected);
      this.$emit("change", genreId, isSelected);
    },
  },
};
</script>

<style scoped>
.genre-filter input {
  display: none;
}
.genre-filter span.active {
  background-color: red;
  color: #fff;
}
.genre-filter {
  display: flex;
  flex-wrap: wrap;
  height: 70px;
  gap: 18px;
}
.genre-filter span {
  padding: 5px 15px;
  background-color: #6e5656;
  border-radius: 5px;
  cursor: pointer;
}
@media (max-width: 768px) {
  .genre-filter::-webkit-scrollbar {
    display: none;
  }
  .genre-filter {
    flex-wrap: nowrap;
    height: auto;
    overflow: scroll;
    gap: 8px;
    width: 100%;
    align-items: center;
  }
}
</style>
