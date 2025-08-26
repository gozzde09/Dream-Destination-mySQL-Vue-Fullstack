<script setup>
import { ref } from 'vue';
import AllCountries from '@/components/AllCountries.vue';
import AddCountryForm from '@/components/AddCountryForm.vue';



const countryDataToBeSaved = ref(null);
const isFormsActive = ref(false);

// Define the emits option directly inside the setup function
//const emits = defineEmits(['forms-active-changed']);

// Handle the event emitted by AllCountries.vue
const handleCountryDataChange = (newCountryData) => {
    countryDataToBeSaved.value = newCountryData;
};

// Handle the event emitted by AllCountries.vue to toggle forms active status
const handleFormsActiveChange = (newValue) => {
    isFormsActive.value = newValue;

    // console.log("latest value of bool", isFormsActive.value)
};
</script>

<template>
    <div>

        <!-- Pass countryDataToBeSaved as prop -->
        <AddCountryForm :countryData="countryDataToBeSaved" @forms-active-changed="handleFormsActiveChange"
            v-if="isFormsActive" />

        <!-- Listen for the 'country-data-changed' event and call the handleCountryDataChange function -->
        <AllCountries @country-data-changed="handleCountryDataChange" @forms-active-changed="handleFormsActiveChange" />

    </div>
</template>

<style></style>
