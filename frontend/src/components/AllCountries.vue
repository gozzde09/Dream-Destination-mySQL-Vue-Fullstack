<script setup>
import { ref, onMounted, getCurrentInstance, computed } from 'vue'

const searchTerm = ref('')

const filteredCountries = computed(() => {
  return countriesArray.value.filter((country) =>
    country.countryName.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})
const countriesArray = ref([])
const countryNameToBeSaved = ref(null)
const countryDataToBeSaved = ref(null)
const isFormsActive = ref(false)

const emit = getCurrentInstance().emit

onMounted(() => {
  getAllCountriesOnStart()
})

async function getAllCountriesOnStart() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/region/europe')
    const countryData = await response.json()
    const countryDescriptions = await fetchAllCountryDescriptions(countryData)

    const countries = await Promise.all(
      countryData
        .map(async (currentCountryData, index) => {
          if (
            currentCountryData.capital &&
            Array.isArray(currentCountryData.capital) &&
            currentCountryData.capital.length > 0
          ) {
            const countryImageUrl = await CountryImage(currentCountryData.name.common)
            return {
              countryName: currentCountryData.name.common,
              countryDescription: countryDescriptions[index],
              countryCapital: currentCountryData.capital[0],
              countryPopulation: currentCountryData.population,
              countryContinentName: currentCountryData.region,
              countryLanguage: currentCountryData.languages
                ? currentCountryData.languages[Object.keys(currentCountryData.languages)[0]]
                : '',
              countryCurrencyName: currentCountryData.currencies
                ? currentCountryData.currencies[Object.keys(currentCountryData.currencies)[0]].name
                : '',
              countryCurrencyAcronym: currentCountryData.currencies
                ? Object.keys(currentCountryData.currencies)[0]
                : '',
              countryImageUrl
            }
          } else {
            return null
          }
        })
        .filter((country) => country !== null)
    )

    countriesArray.value = countries
    countriesArray.value.sort((a, b) => a.countryName.localeCompare(b.countryName)) //Alfabetisk ordning
  } catch (error) {
    console.error('Error fetching countries:', error)
  }
}

async function fetchAllCountryDescriptions(countryData) {
  const descriptionPromises = countryData.map(async (currentCountryData) => {
    const descriptionResponse = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${currentCountryData.name.common}`
    )
    const descriptionData = await descriptionResponse.json()
    return descriptionData.extract
  })

  return Promise.all(descriptionPromises)
}

const CountryImage = async (countryName) => {
  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${countryName}`, {
      headers: {
        Authorization: 'Client-ID YXkvGz4I8Jzxgr9QCjb3uCZC7y4_wyYabGwGEtXUJJg'
      }
    })
    const data = await response.json()
    console.log(data.results[0].urls.regular)
    return data.results[0].urls.regular
  } catch (err) {
    console.error('Unsplash fetch error:', err)
  }
}

async function passDataToForm(incomingCountryName) {
  // Set the value of countryNameToBeSaved ref
  countryNameToBeSaved.value = incomingCountryName

  // Find the country object based on the country name
  countryDataToBeSaved.value = countriesArray.value.find(
    (country) => country.countryName === countryNameToBeSaved.value
  )

  // Call method for emitting data
  emitCountryDataToBeSaved()
}

// Emit the countryDataToBeSaved value when it's updated
function emitCountryDataToBeSaved() {
  // Emit an event with the countryDataToBeSaved value
  if (countryDataToBeSaved.value) {
    // Emit an event named 'country-data-changed' with the countryDataToBeSaved value
    emit('country-data-changed', countryDataToBeSaved.value)

    //Toggle boolean to show forms and pass it to forms child
    isFormsActive.value = true
    emit('forms-active-changed', isFormsActive.value)
  }
}
</script>

<template>
  <h2 class="title text-center my-4">Choose your next travel</h2>
  <input
    type="text"
    v-model="searchTerm"
    placeholder="Search a country..."
    class="mx-auto form-control my-2"
    style="width: 75%"
  />
  <div class="d-flex column">
    <div class="d-flex justify-content-evenly flex-wrap" v-if="countriesArray.length > 0">
      <b-card
        no-body
        class="overflow-hidden card m-2"
        style="max-width: 400px; max-height: max-content"
        v-for="country in filteredCountries"
        :key="country.countryName"
      >
        <b-card-img
          :src="country.countryImageUrl"
          alt="Country Image"
          class="rounded-0"
          loading="lazy"
          style="height: 200px"
        ></b-card-img>
        <b-card-body class="title-and-des-container">
          <h3>{{ country.countryName }}</h3>
          <b-card-text class="title-and-des-wrapper">
            <p>
              {{ country.countryDescription }}
            </p>
          </b-card-text>
        </b-card-body>
        <div class="btn-container align-items-end my-4">
          <button
            type="button"
            class="btn btn-success"
            @click="passDataToForm(country.countryName)"
          >
            Add to bucketlist
          </button>
          <router-link :to="`/`" class="btn btn-info"> Back to the list </router-link>
        </div>
      </b-card>
    </div>
    <div v-else class="mx-auto my-4">
      <p style="font-size: x-large; color: chocolate">Loading the countries...</p>
    </div>
  </div>
</template>

<style scoped>
.btn-container {
  display: flex;
  justify-content: space-around;
}
</style>
