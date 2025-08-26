<template>
  <div class="country-details d-flex flex-column flex-wrap justify-content-evenly">
    <h2 class="text-center my-4">MY REVIEWS</h2>
    <div v-if="reviewData.length > 0" class="d-flex flex-wrap justify-content-evenly">
      <div v-for="country in connectedData" :key="country.countryId">
        <div class="country-card">
          <div v-for="(review, index) in country.reviews" :key="index">
            <BCard no-body class="overflow-hidden m-4 card" style="width: 450px">
              <BRow class="g-0">
                <BCol md="6">
                  <BCardImg :src="'https://source.unsplash.com/random/1080x1080?' + country.countryName"
                    alt="Country Image" style="max-width: 200px; height: auto;" loading="lazy" />
                </BCol>
                <BCol md="6">
                  <BCardBody>
                    <div class="d-flex justify-content-between">
                      <h4>{{ country.countryName }}</h4>
                    </div>
                    <p><strong>Capital:</strong> {{ country.countryCapital }}</p>
                    <p><strong>Population:</strong> {{ country.countryPopulation }}</p>
                    <p class="truncate">{{ country.countryDescription }}</p>
                  </BCardBody>
                </BCol>

                <div class="reviews m-4">
                  <div class="d-flex">
                    <h5><strong>Review: </strong></h5>
                    <img @click="confirmDelete(review._id)" class="mx-2 icon " src="../assets/delete.svg"
                      alt="delete-symbol" style="width:20px; height:20px" :title="deleteTooltip" />
                  </div>
                  <div class="review">
                    <p><strong>Title: </strong> {{ review.reviewTitle }}</p>
                    <p>
                      <strong>Rating: </strong>
                      <span class="rating-container" v-for="(star, index) in 5" :key="index">
                        <i :class="[star <= review.reviewRating ? 'bi bi-star-fill' : 'bi bi-star']"></i>
                      </span>
                    </p>
                    <p><strong>Description: </strong> {{ review.reviewDescription }}</p>
                    <!-- Add other review details as needed -->
                  </div>

                </div>
              </BRow>
            </BCard>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="d-flex flex-column mx-auto my-4">
      <p style="font-size:x-large; color:chocolate">No reviews are available at the moment. Please review a country.
      </p>
      <router-link :to="`/`" class="btn btn-success mx-auto">
        To the Bucketlist
      </router-link>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';

// Define refs for country data and review data
const countryData = ref([]);
const reviewData = ref([]);
const connectedData = ref([]);

// Function to fetch country data from MySQL
const fetchCountryData = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/countries');
    if (!response.ok) {
      throw new Error('Failed to fetch country data');
    }
    countryData.value = await response.json();
  } catch (error) {
    console.error('Error fetching country data:', error);
  }
};

// Function to fetch review data from MongoDB
const fetchReviewData = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/reviews');
    if (!response.ok) {
      throw new Error('Failed to fetch review data');
    }
    reviewData.value = await response.json();
  } catch (error) {
    console.error('Error fetching review data:', error);
  }
};

// Function to connect country data with reviews
const connectData = () => {
  connectedData.value = countryData.value.map(country => ({
    ...country,
    reviews: reviewData.value.filter(review => review.visitedCountry === country.countryName)
  })).filter(country => country.reviews.length > 0);
  // console.log(connectedData.value);
};

onMounted(async () => {
  // Fetch country data
  await fetchCountryData();

  // Fetch review data
  await fetchReviewData();

  // Connect data
  connectData();
});

//DELETE REVIEW AFTER CONFIRM
//tooltip
const deleteTooltip = ref("Delete review");

const deleteReview = async (reviewId) => {
  try {
    const response = await fetch('http://localhost:3000/api/reviews', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reviewId }) // Send reviewId to request body
    });
    if (!response.ok) {
      throw new Error('Failed to delete review');
    }
    else {
      // console.log('Review deleted successfully ' + reviewId);
      location.reload();// RELOAD Reviews page
    }
  } catch (error) {
    console.error("DELETE review error:", error);
  }
}

const confirmDelete = async (reviewId) => {
  if (confirm("Are you sure to delete this review?")) {
    deleteReview(reviewId);
  }
}
</script>

<style scoped>
.review p {
  display: flex;
}

strong {
  margin-right: 5px;
}

.rating-container {
  display: flex;
  flex-direction: row;
  width: fit-content;
}


.country-card {
  padding: 0;
  margin: 0;
}

.country-details {
  background-color: lightblue;

}

.bi-star-fill,
.bi-star {
  color: #ffc107;
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
