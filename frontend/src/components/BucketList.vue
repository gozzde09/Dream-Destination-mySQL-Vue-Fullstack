<script setup>
//Gözde
import { ref, onMounted, onUnmounted } from 'vue';
//Frida
import ReviewCountryForm from './ReviewCountryForm.vue';

// Define reactive variable to store the ID of the selected country
const selectedCountry = ref(null);
const cardInfo = ref(null);

const handleEscKey = (event) => {
  if (event.key === 'Escape') {
    closeForm();
  }
};

// Method to show the review form for the selected country
const showReviewForm = (countryId) => {
  selectedCountry.value = countryId;
  // Set the card information to pass to the form component
  cardInfo.value = countries.value.find(country => country.countryId === countryId);
  // event listener for "Esc" key press
  window.addEventListener('keydown', handleEscKey);
};

onUnmounted(() => {
  // Remove event listener to prevent memory leaks
  window.removeEventListener('keydown', handleEscKey);
});

// Method to close the review form
const closeForm = () => {
  selectedCountry.value = null;
  // Remove event listener when the form is closed
  window.removeEventListener('keydown', handleEscKey);
};
//End Frida

const countries = ref([]);
//ToolTips for icons
const editTooltip = ref("Edit");
const deleteTooltip = ref("Delete");

//Filtrering according to continents
const continents = ref(null);
const selectedContinent = ref("");

//FETCH COUNTRY DATA FROM SERVER
const fetchCountries = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/countries');
    const data = await response.json();
    countries.value = data;
    countries.value.sort((a, b) => a.countryName.localeCompare(b.countryName)); //Alfabetisk
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
};

onMounted(() => {
  fetchCountries(),
  fetchContinents()
});

//EDIT COUNTRY
const countryBeingEdited = ref(null);
const countryName = ref("");
const editCountry = async (country) => {
  fetch(`http://localhost:3000/api/countries/${country.countryId}`, {
    body: JSON.stringify({ countryId: country.countryId, countryName: country.countryName, countryPopulation: country.countryPopulation }),
    headers: { "Content-Type": "application/json", },
    method: "PUT",
  }).then((result) => {
    console.log(country.countryId);
    countries.value = result;
    fetchCountries();
    countryBeingEdited.value = null,
    countryName.value = "";
    closeForm()
    // console.log("Redigerat land " + country.countryName + " är sparad!");
  }).catch((error) => {
    console.log("EDIT country error:", error)
  });
}

//DELETE COUNTRY AFTER CONFIRM
const deleteCountry = async (country) => {
  fetch(`http://localhost:3000/api/countries/${country.countryId}`, {
    method: "DELETE",
  }).then(() => {
    console.log(country.countryId);
    console.log("Country " + country.countryName + " raderad!");
    fetchCountries(); // RELOAD COUNTRIES
  }).catch((error) => {
    console.log("DELETE country error:", error)
  });
}
//
const confirmDelete = async (country) => {
  if (confirm("Are you sure to delete this country?")) {
    deleteCountry(country);
  }
}
//FETCH CONTINENT LIST FROM DATABASE
const fetchContinents = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/continents/`);
    const data = await response.json();
    // console.log(data)
    continents.value = data;
    return data;
  } catch (error) {
    console.error('Error fetching continents:', error);
    throw error;
  }
};
//FETCHA SQL QUERY
const fetchFilteredCountries = async (continentId) => {
  try {
    // If continentId is empty fetch all countries
    const endpoint = continentId ? `http://localhost:3000/api/continents/${continentId}` : 'http://localhost:3000/api/countries';
    const response = await fetch(endpoint);
    countries.value = await response.json();
  } catch (error) {
    console.error('Error fetching filtered countries:', error);
  }
};
</script>

<template>
  <h1 class="mx-auto my-4">MY BUCKETLIST</h1>
  <div class="d-flex flex-row justify-content-around">
    <!-- SELECT CONTINENT -->
    <div>
      <select v-model="selectedContinent" @change="fetchFilteredCountries(selectedContinent)">
        <option selected value="">Select a continent</option>
        <option v-for="continent in continents" :key="continent.continentId" :value="continent.continentId">{{
          continent.continentName }}</option>
      </select>
    </div>
    <router-link :to="`countries`" class="btn btn-success">
      Add a new country
    </router-link>
  </div>
  <!-- COUNTRY CARD -->
  <div class="d-flex column justify-content-evenly flex-wrap" v-if="countries.length > 0">
    <BCard no-body class="overflow-hidden m-4 card" style="max-width:40% ; max-height:max-content"
      v-for="country in countries" :key="country.countryId" v-cloak>
      <BRow class="g-0">
        <BCol md="6">
          <BCardImg :src="'https://source.unsplash.com/random/1080x1080?' + country.countryName" alt="Country Image"
            class="rounded-0" loading="lazy" />
        </BCol>
        <BCol md="6">
          <BCardBody>
            <div class="d-flex justify-content-between">
              <h4>{{ country.countryName }}</h4>
              <div>
                <img class="mx-2 icon" src="../assets/edit.svg" alt="edit-symbol" style="width:20px; height:20px"
                  :title="editTooltip" @click="countryBeingEdited = country.countryId" />
                <img @click="confirmDelete(country)" class="mx-2 icon" src="../assets/delete.svg" alt="delete-symbol"
                  style="width:20px; height:20px" :title="deleteTooltip" />
              </div>
            </div>
            <BCardText>
              <p><strong>Capital:</strong> {{ country.countryCapital }}</p>
              <p><strong>Population:</strong> {{ country.countryPopulation }}</p>
              <p class="truncate">{{ country.countryDescription }}</p>
              <!-- BUTTONS -->
              <div class="d-flex justify-content-between">
                <router-link :to="`details/${country.countryName}`" class="btn btn-info mx-auto my-4">
                  Read more
                </router-link>
                <!-- Button to show review form -->
                <button @click="showReviewForm(country.countryId)" class="btn btn-success mx-auto my-4">
                  Review
                </button>
              </div>
              <!-- Review form for the specific card -->
              <ReviewCountryForm v-if="selectedCountry === country.countryId" @closeForm="closeForm"
                :cardInfo="cardInfo" />

              <!-- EDIT FORM -->
              <form v-if="countryBeingEdited === country.countryId">
                <div class="form-group">
                  <label for="name"> <strong>Country name: </strong></label>
                  <input v-model="country.countryName" type="text" class="form-control" required />
                  <label for="population"> <strong>Country population: </strong></label>
                  <input v-model="country.countryPopulation" type="text" class="form-control" required />
                </div>
                <input @click="editCountry(country)" type="button" value="Update" class="btn btn-warning my-2 m-2" />
              </form>
              <BCol class="flex justify-content-around">
              </BCol>
            </BCardText>
          </BCardBody>
        </BCol>
      </BRow>
    </BCard>
  </div>
  <div v-else class="mx-auto my-4">
    <p style="font-size:x-large; color:chocolate">No countries found in the selected continent.</p>
  </div>
</template>
<style>
.btn {
  color: white !important;
  text-decoration: none !important;
}

.icon {
  cursor: pointer;
}

label,
input {
  margin: 0 5px 0 0 !important;
}

form {
  padding: 5px;
}

[v-cloak] {
  display: none;
}
.truncate {
  display: -webkit-box;
  /* Required for Safari */
  -webkit-box-orient: vertical;
  /* Arrange content vertically */
  overflow: hidden;
  /* Hide overflowing content */
  text-overflow: ellipsis;
  /* Show ellipsis for overflow */
  -webkit-line-clamp: 3;
  /* Limit the number of displayed lines */
  max-height: 3 * 1.2em;
  /* Adjust based on line height */
}
</style>
