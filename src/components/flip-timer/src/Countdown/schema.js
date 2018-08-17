import { func } from 'prop-types';

export default {
  types: {
    stop: Number,
    onStart: func,
    onStop: func,
  },

  defaults: {
    start: false,
  },
};
