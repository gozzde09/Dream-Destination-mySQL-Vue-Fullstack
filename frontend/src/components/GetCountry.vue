<script setup>
//Gözde
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
const country = ref([]);
const route = useRoute();
// console.log("route: " + route.params.id);
const countryName = ref(route.params.id);
const fetchCountry = async (countryName) => {
  try {
    fetch(`http://localhost:3000/api/countries/details/${countryName}`)
      .then(response => response.json())
      .then(result => {
        country.value = result;
        // console.log(country.value);
      })
  } catch (error) {
    console.error("Fetch country error:", error);
  };
}
  ;
fetchCountry(countryName.value);
watch(() => route.params.id, () => {
  // console.log(route.params.id);
  fetchCountry(route.params.id);
});

// const fetchCountry = async (id) => {
//   try {
//     fetch(`http://localhost:3000/api/countries/${id}`)
//       .then(response => response.json())
//       .then(result => {
//         // console.log(result);
//         country.value = result;
//       })
//   } catch (error) {
//     console.error("Fetch country error:", error);
//   };
// }
//   ;
// fetchCountry(id.value);
// watch(() => route.params.id, () => {
//   // console.log(route.params.id);
//   fetchCountry(route.params.id);
// });
</script>

<template>
  <div class="d-flex column justify-content-evenly flex-wrap">
    <BCard no-body class="overflow-hidden m-4 card" style="max-width:75%" v-if="country">
      <BRow class="g-0">
        <BCol md="6">
          <BCardImg :src="'https://source.unsplash.com/random/1080x1080?' + country.CountryName" alt="Country Image"
            class="rounded-0" />
        </BCol>
        <BCol md="6">
          <BCardBody>
            <BCardText>
              <h2>More about {{ country.CountryName }}</h2>
              <p><strong>Continent:</strong> {{ country.ContinentName }}</p>
              <p><strong>Capital:</strong> {{ country.CountryCapital }}</p>
              <p><strong>Population:</strong> {{ country.CountryPopulation }}</p>
              <p><strong>Language:</strong> {{ country.LanguageName ? country.LanguageName : '-' }}</p>
              <p><strong>Currency:</strong> {{ country.CurrencyName ? `${country.CurrencyName} -
                ${country.CurrencyAcronym}` : '-' }}</p>
              <p><strong>Description:</strong> {{ country.CountryDescription }}</p>
            </BCardText>
          </BCardBody>
          <div class="d-flex align-items-end mx-4">
            <router-link :to="`/`" class="btn btn-info">
              Go back to the list
            </router-link>
          </div>
        </BCol>
      </BRow>
    </BCard>
  </div>
</template>
