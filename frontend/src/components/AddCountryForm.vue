<template>
    <div class="overlay"></div>
    <div class="forms-container">
        <BCard no-body class="overflow-hidden" style="max-width: 540px;">
            <button type="button" class="btn-close" aria-label="Close" @click="closeForm"></button>
            <div class="form-content-container">
                <BRow class="g-0">
                    <BCol md="6">
                        <BCardImg :src="props.countryData.countryImageUrl" alt="Image" class="rounded-0" />
                    </BCol>
                    <BCol md="6">
                        <BCardBody class="yeah">
                            <label for="countryName">Country name:</label>
                            <input type="text" v-model="editedCountryName">
                            <BCardText class="yeah-again">
                                <label for="countryDescription">Country information:</label>
                                <textarea name="description-tbx" id="" cols="30" rows="10"
                                    v-model="editedCountryDescription"></textarea>
                                <label for="">Continent name:</label>
                                <input type="text" v-model="editedContinentName">
                                <label for="">Capital name:</label>
                                <input type="text" v-model="editedCountryCapital">
                                <label for="">Language:</label>
                                <input type="text" v-model="editedCountryLanguage">
                                <label for="">Currency:</label>
                                <input type="text" v-model="editedCountryCurrency">
                                <!-- <label for="">Currency acronym:</label>
                                <input type="text" v-model="editedCountryCurrencyAcronym"> -->
                            </BCardText>
                            <div class="btn-container">
                                <button type="button" class="btn btn-success"
                                    @click="saveEditedDataAndCloseForm">Save</button>
                            </div>

                        </BCardBody>
                    </BCol>
                </BRow>
            </div>
        </BCard>

    </div>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted } from 'vue';

const editedContinentName = ref('');
const editedCountryName = ref('');
const editedCountryDescription = ref('');
const editedCountryLanguage = ref('')
const editedCountryCurrency = ref('');
const editedCountryCurrencyAcronym = ref('');
const editedCountryCapital = ref('')


onMounted(() => {
    // Initialize form fields with props data
    editedContinentName.value = props.countryData.countryContinentName;
    editedCountryName.value = props.countryData.countryName;
    editedCountryDescription.value = props.countryData.countryDescription;
    editedCountryLanguage.value = props.countryData.countryLanguage;
    editedCountryCurrency.value = props.countryData.countryCurrencyName;
    editedCountryCurrencyAcronym.value = props.countryData.countryCurrencyAcronym;
    editedCountryCapital.value = props.countryData.countryCapital;
});

const saveEditedDataAndCloseForm = async () => {
    await IfCountryExist()
};
//GÖZDE START
//FETCH CONTINENTS AND GET ID
const continentArray = ref([]);
const fetchContinentData = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/continents');
        if (!response.ok) {
            throw new Error('Failed to fetch continent data');
        }
        continentArray.value = await response.json();
        // console.log(continentArray.value);
        return continentArray.value;
    } catch (error) {
        console.error('Error fetching continent data:', error);
    }
};

const getContinentId = async (continentName) => {
    await fetchContinentData();
    const existingContinent = continentArray.value.find(continent => continent.continentName === continentName);
    if (existingContinent) {
        return existingContinent.continentId;
    } else {
        const continentData = { continentName };
        const continentPost = await fetch('http://localhost:3000/api/continents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(continentData)
        });
        if (!continentPost.ok) {
            throw new Error('Failed to save continent: ' + continentPost.statusText);
        }
        await fetchContinentData();
        const newContinent = continentArray.value.find(continent => continent.continentName === props.countryData.countryContinentName);
        if (newContinent) {
            return newContinent.continentId;
        } else {
            console.error('Continent not found in the array');
        }
    }
};
//FETCH LANGUAGES AND GET ID
const languageArray = ref([]);
const fetchLanguageData = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/languages');
        if (!response.ok) {
            throw new Error('Failed to fetch language data');
        }
        languageArray.value = await response.json();
        // console.log(languageArray.value);
        return languageArray.value;
    } catch (error) {
        console.error('Error fetching language data:', error);
    }
};

const getLanguageId = async (languageName) => {
    // console.log(languageName);
    await fetchLanguageData();
    const existingLanguage = languageArray.value.find(language => language.languageName === languageName);
    if (existingLanguage) {
        // console.log(existingLanguage.languageId);
        return existingLanguage.languageId;

    } else {
        const languageData = { languageName };
        const languagePost = await fetch('http://localhost:3000/api/languages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(languageData)
        });
        if (!languagePost.ok) {
            throw new Error('Failed to save language: ' + languagePost.statusText);
        }
        await fetchLanguageData();
        const newLanguage = languageArray.value.find(language => language.languageName === props.countryData.countryLanguage);
        if (newLanguage) {
            return newLanguage.languageId;
        } else {
            console.error('language not found in the array');
        }
    }
};

//FETCH CURRENCIES AND GET ID
const currencyArray = ref([]);
const fetchCurrencyData = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/currencies');
        if (!response.ok) {
            throw new Error('Failed to fetch currency data');
        }
        currencyArray.value = await response.json();
        console.log(currencyArray.value);
        return currencyArray.value;
    } catch (error) {
        console.error('Error fetching currency data:', error);
    }
};

const getCurrencyId = async (currencyName) => {
    // console.log(currencyName);
    await fetchCurrencyData();
    const existingCurrency = currencyArray.value.find(currency => currency.currencyName.toLowerCase() === currencyName.toLowerCase());
    if (existingCurrency) {
        // console.log(existingCurrency.currencyId);
        return existingCurrency.currencyId;
    } else {
        const currencyAcronym = props.countryData.countryCurrencyAcronym;
        const currencyData = { currencyName, currencyAcronym };
        const currencyPost = await fetch('http://localhost:3000/api/currencies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currencyData)
        });
        if (!currencyPost.ok) {
            throw new Error('Failed to save currency: ' + currencyPost.statusText);
        }
        await fetchCurrencyData();
        const newCurrency = currencyArray.value.find(currency => currency.currencyName === props.countryData.countryCurrencyName);
        if (newCurrency) {
            return newCurrency.currencyId;
        } else {
            console.error('Currency not found in the array');
        }
    }
};
//FETCH COUNTRIES TO CONTROLL IF COUNTRY ALREADY EXISTS IN THA DATABASE
const countryArray = ref([]);
const IfCountryExist = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/countries');
        if (!response.ok) {
            throw new Error('Failed to fetch countries');
        }
        countryArray.value = await response.json();
        const existingCountry = countryArray.value.find(country => country.countryName === props.countryData.countryName);
        if (existingCountry) {
            alert('This country already exists in your bucket list. Please choose a different destination.');
            closeForm();
        }
        else{
            saveCountry();
            closeForm()
        }
    } catch (error) {
        console.error(error);
    }
};
//GÖZDE END
//Insert into all the data to Country Tabell
const saveCountry = async () => {
    const continentId = await getContinentId(props.countryData.countryContinentName);
    const languageId = await getLanguageId(props.countryData.countryLanguage);
    const currencyId = await getCurrencyId(props.countryData.countryCurrencyName);
    const countryData = {
        countryName: editedCountryName.value,
        countryDescription: editedCountryDescription.value,
        countryCapital: editedCountryCapital.value,
        countryPopulation: props.countryData.countryPopulation,
        countryContinentId: continentId,
        countryLanguageId: languageId,
        countryCurrencyId: currencyId
    };
    const countryResponse = await fetch('http://localhost:3000/api/countries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(countryData)
    });
    if (!countryResponse.ok) {
        throw new Error('Failed to save country: ' + countryResponse.statusText); }
};

// Define the emits option
//const emits = defineEmits(['forms-active-changed']);

// Get the emit function
const emit = getCurrentInstance().emit;

const props = defineProps({
    countryData: Object
});
// console.log(props.countryData)

function closeForm() {
    // Emit the forms-active-changed event with the value of false
    emit('forms-active-changed', false);
}

</script>


<style scoped>
.overlay {
    background-color: white;
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    opacity: 0.75;
    filter: blur(5px);
}

.forms-container {
    opacity: 1;
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    padding: 0 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 101;
}

.form-content-container {
    max-height: calc(100vh - 80px);
    /* Subtract the padding */
    overflow-y: auto;
}


.btn-close {
    position: absolute;
    top: 10px;
    right: 10px;
}

p {
    margin-bottom: 0;
}

input {
    margin-bottom: 20px;
}

textarea {
    margin-bottom: 20px;
}

.yeah,
.yeah-again {
    display: flex;
    flex-direction: column;
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
