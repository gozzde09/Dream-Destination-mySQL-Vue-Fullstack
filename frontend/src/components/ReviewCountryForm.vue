<template>
  <div class="review-form-overlay">
    <div class="review-form">
      <div class="header">
        <h2>Review Form</h2>
        <button class="close-button" @click="emitCloseForm">X</button>
      </div>
      <!-- Display country details and picture -->
      <div v-if="country">
        <BCard no-body class="overflow-hidden m-4 card">
          <BRow class="g-0">
            <BCol md="6">
              <!-- Adjust the width and height of the image here -->
              <BCardImg :src="'https://source.unsplash.com/random/1080x1080?' + country.countryName" alt="Country Image"
                style="width: 200px; height: auto;" />
            </BCol>
            <BCol md="6">
              <BCardBody>
                <h2>{{ country.countryName }}</h2>
                <p class="truncate">{{ country.countryDescription }}</p>
                <p><strong>Capital:</strong> {{ country.countryCapital }}</p>
                <p><strong>Population:</strong> {{ country.countryPopulation }}</p>
              </BCardBody>
            </BCol>
          </BRow>
        </BCard>
      </div>
      <!-- Review form fields -->
      <BCard bg-variant="light" class="mt-4">
        <BFormGroup label-cols-lg="3" label="Review Information" label-size="lg" label-class="fw-bold pt-0"
          class="mb-0">
          <BFormGroup label="Title:" label-for="review-title" label-cols-sm="3" label-align-sm="end">
            <BFormInput id="review-title" v-model="reviewTitle" />
          </BFormGroup>

          <!-- Star rating input -->
          <BFormGroup label="Rating:" label-for="review-rating" label-cols-sm="3" label-align-sm="end">
            <div class="star-rating">
              <span v-for="star in 5" :key="star" @click="setRating(star)"
                :class="{ filled: star <= reviewRating }">&#9733;</span>
            </div>
          </BFormGroup>

          <BFormGroup label="Description:" label-for="review-description" label-cols-sm="3" label-align-sm="end">
            <BFormTextarea id="review-description" v-model="reviewDescription" />
          </BFormGroup>
        </BFormGroup>
      </BCard>
      <div class="text-center mt-3">
        <button class="btn btn-primary" @click="saveReviewAndCloseForm">Save Review</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Define props to receive card information
const props = defineProps({
  cardInfo: Object,
});

const country = ref(props.cardInfo);

// Define emits for the custom close event
const emits = defineEmits(['closeForm']);

// Method to close the form
const emitCloseForm = () => {
  emits('closeForm');
};

// Define reactive variables for the review form fields
const reviewTitle = ref('');
const reviewDescription = ref('');
const reviewRating = ref(0); // Initialize rating as 0

// Method to set the rating
const setRating = (rating) => {
  reviewRating.value = rating;
};
const saveReviewAndCloseForm = () => {
  saveReview(); // Call the saveReview method
  emitCloseForm(); // Emit closeForm event to close the form
};

const saveReview = async () => {
  try {
    const reviewData = {
      reviewTitle: reviewTitle.value,
      reviewDescription: reviewDescription.value,
      reviewRating: reviewRating.value,
      visitedCountry: country.value.countryName // Get the country name from the card
    };

    const response = await fetch('http://localhost:3000/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    });

    if (response.ok) {
      console.log('Review saved successfully');
    } else {
      console.error('Failed to save review:', response.statusText);
      // Optionally, handle error here
    }
  } catch (error) {
    console.error('Error saving review:', error);
    // Handle errors here
  }
};

</script>

<style scoped>
.review-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.review-form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  width: 70%;
  max-width: 800px;
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
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  cursor: pointer;
  font-size: 20px;
}

.star-rating {
  font-size: 24px;
  /* Adjust size of stars */
}

.star-rating span {
  cursor: pointer;
  color: #ccc;
  /* Empty star color */
}

.star-rating span.filled {
  color: #ffc107;
  /* Filled star color */
}
</style>
