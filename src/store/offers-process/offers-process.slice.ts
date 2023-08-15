import {createSlice} from '@reduxjs/toolkit';
import {CITIES, MAX_REVIEWS_ON_PAGE, NameSpace} from '../../const.ts';
import {ChosenOffer, Offer} from '../../mocks/offers.ts';
import {shuffleNearby} from '../../utils.ts';
import {Review} from '../../mocks/reviews.ts';
import {allowedSortMethods, SortMethods} from '../../components/places-sorting-form/places-sorting-form.tsx';

export type City = typeof CITIES[number];

export type OfferInfo = {
    offerDetails: ChosenOffer | null;
    offerReviews: Review[];
    nearbyOffers: Offer[];
};

type InitialOffersState = {
  offersCity: City;
  offers: Offer[];
  savedOrderOffers: Offer[];
  sortMethod: allowedSortMethods;
  chosenOffer: OfferInfo;
}

const initialOffersState: InitialOffersState = {
  offersCity: 'Amsterdam',
  offers: [],
  savedOrderOffers: [],
  sortMethod: SortMethods.ByPopularity,
  chosenOffer: {
    offerDetails: null,
    offerReviews: [],
    nearbyOffers: [],
  }
};

export const offersProcess = createSlice({
  name: NameSpace.Offers,
  initialState: initialOffersState,
  reducers: {
    loadOffers: (state, action: {payload: Offer[]}) => {
      state.offers = action.payload;
      state.savedOrderOffers = action.payload;
    },
    loadNearbyOffers: (state, action: {payload: Offer[]}) => {
      state.chosenOffer.nearbyOffers = shuffleNearby(action.payload);
    },
    loadChosenOffer: (state, action: {payload: ChosenOffer}) => {
      state.chosenOffer.offerDetails = action.payload;
    },
    loadOfferReviews: (state, action: {payload: Review[]}) => {
      state.chosenOffer.offerReviews = action.payload.slice(-MAX_REVIEWS_ON_PAGE).reverse();
    },
    changeOffersCity: (state, action: {payload: City}) => {
      state.offersCity = action.payload;
    },
    sortOffers: (state, action: {payload: allowedSortMethods}) => {
      state.sortMethod = action.payload;
      switch(state.sortMethod){
        case SortMethods.ByPopularity:
          state.offers = state.savedOrderOffers;
          break;
        case SortMethods.ByPriceIncrease:
          state.offers = state.offers.sort((a, b) => a.price - b.price);
          break;
        case SortMethods.ByPriceDecrease:
          state.offers = state.offers.sort((a, b) => b.price - a.price);
          break;
        case SortMethods.ByRating:
          state.offers = state.offers.sort((a, b) => b.rating - a.rating);
          break;
        default:
          state.offers = state.savedOrderOffers;
      }
    }
  },
});

export const {
  loadOffers,
  loadNearbyOffers,
  loadChosenOffer,
  loadOfferReviews,
  sortOffers,
  changeOffersCity} = offersProcess.actions;
